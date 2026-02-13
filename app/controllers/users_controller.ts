import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

import hash from '@adonisjs/core/services/hash'
export default class UsersController {
  /**
   * Affiche la liste de tous les utilisateurs (DJs et Orgas)
   */
  async index({ view }: HttpContext) {
    const users = await User.all()
    return view.render('pages/users/index', { users })
  }

  /**
   * Affiche le formulaire de création (Inscription)
   */
  async create({ view }: HttpContext) {
    return view.render('pages/users/create')
  }

  /**
   * Enregistre un nouvel utilisateur
   */
  async store({ request, response }: HttpContext) {
    // Dans un vrai projet, utilise un Validator ici !
    const data = request.only(['fullName', 'email', 'password'])
    await User.create(data)

    return response.redirect().toRoute('users.index')
  }

  /**
   * Affiche un profil spécifique
   */
  async show({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('pages/users/show', { user })
  }

  /**
   * Affiche le formulaire d'édition
   */
  async edit({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('pages/users/edit', { user })
  }

  /**
   * Met à jour les infos d'un utilisateur
   */
  // Pour afficher la page

  // Pour sauvegarder
  public async update({ request, params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.all()

    user.merge({
      fullName: data.fullName,
      location: data.location,
      pricePerGig: data.pricePerGig,
      travelRange: data.travelRange,
      instagramUrl: data.instagramUrl,
      tiktokUrl: data.tiktokUrl,
      youtubeUrl: data.youtubeUrl,
      isDj: data.isDj === '1' || data.isDj === true, // Convertit en boolean
    })

    // Si la ville a changé, on reset les coordonnées pour qu'elles soient recalculées
    if (user.isDirty('location')) {
      user.latitude = null
      user.longitude = null
    }

    await user.save()
    return response.redirect().toRoute('users.show', { id: user.id })
  }

  /**
   * Supprime un compte
   */
  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    return response.redirect().toRoute('users.index')
  }

  async editSecure({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('pages/users/edit_secure', { user })
  }

  public async updateSecurity({ request, response, params, session, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)

    // Check si c'est bien le proprio
    if (auth.user!.id !== user.id) return response.forbidden()

    const { email, password, password_confirmation, oldPassword } = request.all()

    // 1. Vérifier le mot de passe actuel AVANT TOUT
    const isValid = await hash.verify(user.password, oldPassword)
    if (!isValid) {
      session.flash('error', 'Mot de passe actuel incorrect.')
      return response.redirect().back()
    }

    // 2. Gérer le changement d'email
    if (email !== user.email) {
      const emailExists = await User.findBy('email', email)
      if (emailExists) {
        session.flash('error', 'Cet email est déjà pris.')
        return response.redirect().back()
      }
      user.email = email
    }

    // 3. Gérer le changement de mot de passe (si rempli)
    if (password) {
      if (password !== password_confirmation) {
        session.flash('error', 'Les nouveaux mots de passe ne correspondent pas.')
        return response.redirect().back()
      }
      user.password = password
    }

    await user.save()

    session.flash('success', 'Sécurité mise à jour avec succès !')
    return response.redirect().toRoute('users.show', { id: user.id })
  }

  async seartch({ request, view }: HttpContext) {
    // On ne prend que la ville et le budget du client
    const { location, budget } = request.qs()

    let query = User.query().where('isDj', true)

    if (budget) query.where('pricePerGig', '<=', budget)

    let djs = await query

    if (location) {
      const eventCoords = await this.getCoords(location)

      if (eventCoords) {
        const filteredDjs = []

        for (const dj of djs) {
          // Sécurité : Récupération des coordonnées du DJ si manquantes
          if (!dj.latitude || !dj.longitude) {
            if (dj.location) {
              const coords = await this.getCoords(dj.location)
              if (coords) {
                dj.latitude = coords.lat
                dj.longitude = coords.lon
                await dj.save()
              }
            }
          }

          if (dj.latitude && dj.longitude) {
            // Distance entre la soirée (Morges) et le DJ (Apples ou Genève)
            const distanceToEvent = this.calculateDistance(
              eventCoords.lat,
              eventCoords.lon,
              dj.latitude,
              dj.longitude
            )

            // Le DJ décide : s'il n'a rien mis, on met 50km par défaut
            const djMaxRange = dj.travelRange || 50

            // SI la distance de la soirée est OK pour le DJ, on l'affiche
            if (distanceToEvent <= djMaxRange) {
              dj.$extras.distance = Math.round(distanceToEvent)
              filteredDjs.push(dj)
            }
          }
        }
        djs = filteredDjs
        // Tri du plus proche au plus loin
        djs.sort((a, b) => a.$extras.distance - b.$extras.distance)
      }
    }

    return view.render('pages/users/seartch', { users: djs, location })
  }

  /**
   * API Nominatim pour transformer un nom de ville en coordonnées
   */
  private async getCoords(city: string) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`
      const response = await fetch(url, {
        headers: { 'User-Agent': 'DjConceptApp/1.0' },
      })
      const data = await response.json()

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        }
      }
    } catch (e) {
      console.error('Erreur Géo :', e)
    }
    return null
  }

  /**
   * Formule de Haversine (Calcul de distance sur une sphère)
   * C'est la plus précise pour les calculs GPS
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371 // Rayon de la Terre en km

    // Conversion en radians
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Retourne la distance en km
  }
}
