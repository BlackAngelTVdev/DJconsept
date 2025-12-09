import User from "#models/user"
import type { HttpContext } from '@adonisjs/core/http'
import { dd } from "@adonisjs/core/services/dumper"
import Hash from '@adonisjs/core/services/hash'


export default class AuthController {
  /**
   * Affiche le formulaire de login
   */
  public async login({ view }: HttpContext) {
    return view.render('pages/login')
  }

  /**
   * Authentifie l'utilisateur
   */
  public async authenticate({ request, auth, response, session }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])
    
    
    dd(username)
    
    if (!username || !password) {
      session.flash({ error: 'Veuillez remplir tous les champs' })
      return response.redirect().back()
    }

    const user = await User.findBy('username', username)

    if (!user) {
      session.flash({ error: 'Identifiants incorrects' })
      return response.redirect().back()
    }

    const isValid = await Hash.verify(user.password, password)
    if (!isValid) {
      session.flash({ error: 'Identifiants incorrects' })
      return response.redirect().back()
    }

    // Connexion
    await auth.use('web').login(user)
    return response.redirect('/home')
  }

  /**
   * Déconnexion
   */
  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
