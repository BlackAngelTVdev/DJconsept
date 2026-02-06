import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

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
    session.flash('error', 'Tu n\'as pas l\'autorisation de faire ça.')
    return response.redirect().back()
  }

  // On récupère TOUTES les données du formulaire sauf l'email (qu'on a enlevé de la vue)
  const data = request.only([
    'fullName', 
    'location', 
    'pricePerGig', 
    'instagramUrl', 
    'tiktokUrl', 
    'youtubeUrl'
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
}
