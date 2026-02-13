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
  public async update({ request, response, params, session, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)

    // SÉCURITÉ : On vérifie que c'est bien l'utilisateur connecté ou un admin
    if (auth.user!.id !== user.id && !auth.user!.isAdmin) {
      session.flash('error', "Tu n'as pas l'autorisation de faire ça.")
      return response.redirect().back()
    }

    // On récupère TOUTES les données du formulaire sauf l'email (qu'on a enlevé de la vue)
    const data = request.only([
      'fullName',
      'location',
      'pricePerGig',
      'instagramUrl',
      'tiktokUrl',
      'youtubeUrl',
    ])

    // On fusionne et on sauvegarde
    user.merge(data)
    await user.save()

    session.flash('success', 'Profil mis à jour avec succès !')

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
    const { location, distance, budget } = request.qs()

    // 1. On récupère les DJs filtrés par budget (SQL simple)
    let query = User.query()
    if (budget) query.where('pricePerGig', '<=', budget)
    let djs = await query

    // 2. Si l'utilisateur a rempli "Lieu de la soirée" et "Distance max"
    if (location && distance) {
      // On transforme le nom de la ville de la soirée en coordonnées
      const eventCoords = await this.getCoords(location)

      if (eventCoords) {
        const filteredDjs = []

        for (const dj of djs) {
          // Si le DJ n'a pas encore de lat/lon en base, on les récupère une seule fois
          if (!dj.latitude && dj.location) {
            const djCoords = await this.getCoords(dj.location)
            if (djCoords) {
              dj.latitude = djCoords.lat
              dj.longitude = djCoords.lon
              await dj.save() // On enregistre pour ne plus jamais appeler l'API pour ce DJ
            }
          }

          // Calcul mathématique de la distance (Haversine)
          if (dj.latitude && dj.longitude) {
            const km = this.calculateDistance(
              eventCoords.lat,
              eventCoords.lon,
              dj.latitude,
              dj.longitude
            )

            if (km <= parseInt(distance)) {
              filteredDjs.push(dj)
            }
          }
        }
        djs = filteredDjs
      }
    }

    return view.render('pages/users/seartch', { users: djs })
  }
  /**
   * Récupère les coordonnées GPS d'une ville via l'API Nominatim (OpenStreetMap)
   */
  private async getCoords(city: string) {
    try {
      // On encode le nom de la ville pour l'URL
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`

      const response = await fetch(url, {
        headers: {
          // IMPORTANT: Mettre un User-Agent pour éviter d'être bloqué par l'API
          'User-Agent': 'DjConceptApp/1.0',
        },
      })

      const data = await response.json()

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        }
      }
    } catch (error) {
      console.error('Erreur API Géo:', error)
    }
    return null
  }

  /**
   * Calcule la distance en KM entre deux points GPS (Formule de Haversine)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371 // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance en km
  }
}
