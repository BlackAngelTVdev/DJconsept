import type { HttpContext } from '@adonisjs/core/http'

export default async function auth({ auth, response }: HttpContext, next: () => Promise<void>) {
  if (!auth.user) {
    return response.redirect('/login')
  }

  await next()
}
