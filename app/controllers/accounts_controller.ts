import type { HttpContext } from '@adonisjs/core/http'

export default class AccountsController {
  public async account({ view, auth, response }: HttpContext) {

    if (!auth.isAuthenticated) {
      return response.redirect('/login')
    }

    const user = auth.user!


    const userObjects = await user.related('posts').query() 


    return view.render('pages/account', {
      user: user,
      objects: userObjects
    })
  }
}