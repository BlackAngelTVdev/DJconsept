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

    // On stocke l'ancienne ville pour comparer
    const oldLocation = user.location

    user.merge({
      fullName: data.fullName,
      location: data.location,
      pricePerGig: data.pricePerGig,
      travelRange: data.travelRange,
      instagramUrl: data.instagramUrl,
      tiktokUrl: data.tiktokUrl,
      youtubeUrl: data.youtubeUrl,
      isDj: data.isDj === '1' || data.isDj === true,
    })

    // SI LA LOCATION A CHANGÉ : On géo-code tout de suite
    if (user.location && user.location !== oldLocation) {
      const coords = await this.getCoords(user.location)
      if (coords) {
        user.latitude = coords.lat
        user.longitude = coords.lon
      } else {
        // Si Nominatim ne trouve rien, on met à null pour éviter les fausses données
        user.latitude = null
        user.longitude = null
      }
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

  public async seartch({ request, view }: HttpContext) {
    const { location, budget } = request.qs()
    const page = request.input('page', 1)
    const limit = 30 //

    // 1. Requête de base avec Pagination
    const djsPagination = await User.query()
      .where('isDj', true)
      .if(budget, (query) => query.where('pricePerGig', '<=', budget))
      .orderBy('fullName', 'asc') // Pour avoir un ordre cohérent
      .paginate(page, limit)

    let djs = djsPagination.all()

    // 2. LAZY LOADING GÉO (Calculs)
    if (location) {
      const eventCoords = await this.getCoords(location)
      if (eventCoords) {
        const filteredDjs = []

        for (const dj of djs) {
          // Si on n'a pas les coords en base, on géo-code à la volée
          if (!dj.latitude || !dj.longitude) {
            if (dj.location) {
              const coords = await this.getCoords(dj.location)
              if (coords) {
                dj.latitude = coords.lat
                dj.longitude = coords.lon
                await dj.save() // Stocké en base pour la prochaine fois
              }
            }
          }

          // Calcul de distance si on a les coords
          if (dj.latitude && dj.longitude) {
            const distanceToEvent = this.calculateDistance(
              eventCoords.lat,
              eventCoords.lon,
              dj.latitude,
              dj.longitude
            )
            const djLimit = dj.travelRange || 50

            if (distanceToEvent <= djLimit) {
              dj.$extras.distance = Math.round(distanceToEvent)
              filteredDjs.push(dj)
            }
          }
        }
        djs = filteredDjs.sort((a, b) => a.$extras.distance - b.$extras.distance)
      }
    }

    // 3. Rendu (La vue reçoit 20 users max)
    return view.render('pages/users/seartch', {
      users: djs,
      pagination: djsPagination.getMeta(),
      location,
      budget,
    })
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
