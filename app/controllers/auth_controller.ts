import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

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
    return response.redirect().toPath('/login')
  }
  public async register({ request, response, session }: HttpContext) {
    const { fullName, email, password } = request.only(['fullName', 'email', 'password'])

    if (!fullName || !email || !password) {
      session.flash('error', 'Veuillez remplir tous les champs')
      return response.redirect().back()
    }
  }
}
