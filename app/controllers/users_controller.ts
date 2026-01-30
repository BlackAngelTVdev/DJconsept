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
  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['fullName', 'email'])
    
    user.merge(data)
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
}