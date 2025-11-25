import type { HttpContext } from '@adonisjs/core/http'

export default class AccountsController {
  public async account({ view, auth, response }: HttpContext) {
    const isLogged = await auth.check()

    if (!isLogged) {
      return response.redirect('/login')
    }

    return view.render('/account', {
      user: auth.user
    })
  }
}
