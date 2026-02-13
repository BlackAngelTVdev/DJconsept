import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/auth'

export default class AuthController {
  public async login({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    // 1. Log de tentative (optionnel, pratique pour voir qui essaie de se co)
    console.log(`[AUTH] Tentative de connexion pour : ${email}`)

    if (!email || !password) {
      console.warn('[AUTH] Échec : Champs manquants')
      session.flash('error', 'Veuillez remplir tous les champs')
      return response.redirect().back()
    }

    try {
      // 2. Vérification
      const user = await User.verifyCredentials(email, password)

      // 3. Connexion
      await auth.use('web').login(user)

      console.log(`[AUTH] Succès : User ${user.email} (ID: ${user.id}) est connecté`)
      return response.redirect().toRoute('users.index')
    } catch (error) {
      console.error('[AUTH] Erreur de connexion :', error.message)

      session.flash('error', 'Identifiants incorrects')
      return response.redirect().back()
    }
  }

  public async logout({ auth, response }: HttpContext) {
    const user = auth.user
    await auth.use('web').logout()

    console.log(`[AUTH] Déconnexion réussie pour l'utilisateur ID: ${user?.id}`)
    return response.redirect().toRoute('login')
  }

  public async register({ request, auth, response, session }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)

      const user = await User.create(payload)

      await auth.use('web').login(user)
      return response.redirect().toRoute('users.index')
    } catch (error) {
      console.log('ERREUR DETECTEE :', error.constructor.name)
      if (error.messages) {
        console.log('Détails validation :', error.messages)
      } else {
        console.error('Erreur DB/Système :', error.message)
      }
      session.flash('error', 'Erreur lors de l’inscription. Vérifie les champs.')
      return response.redirect().back()
    }
  }
}
