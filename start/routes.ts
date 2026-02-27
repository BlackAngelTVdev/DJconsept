import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// On importe le controller
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
/*
|--------------------------------------------------------------------------
| Routes Publiques (Accessibles par tout le monde)
|--------------------------------------------------------------------------
*/
router.on('/').render('pages/home').as('home')
router.on('/comment-ca-marche').render('pages/how_it_works').as('how-it-works')
router.on('/login').render('pages/auth/login').as('login')
router.on('/register').render('pages/auth/register').as('register')
router.any('*', ({ view }) => {
  return view.render('pages/errors/not_found')
}).as('not_found')
/*
|--------------------------------------------------------------------------
| Espace Membres (CRUD Users)
|--------------------------------------------------------------------------
| On groupe ici tout ce qui demande d'être connecté.
| Pour l'instant on ne met pas de middleware, on prépare juste la structure.
*/
router
  .group(() => {
    router.get('/seartch', [UsersController, 'seartch']).as('users.seartch')
    router.get('/', [UsersController, 'index']).as('users.index')
    router.get('/:id', [UsersController, 'show']).as('users.show')
    router.get('/:id/edit', [UsersController, 'edit']).as('users.edit')
    router.put('/:id', [UsersController, 'update']).as('users.update')
    router.delete('/:id', [UsersController, 'destroy']).as('users.destroy')
    router.get('/:id/secure/edit', [UsersController, 'editSecure']).as('users.secure.edit')
    router
      .patch('/:id/security', [UsersController, 'updateSecurity'])
      .as('users.updateSecurity')
      .use(middleware.auth())
  })
  .prefix('/log/users')
  .use(middleware.auth())

router
  .group(() => {
    router.post('/login', [AuthController, 'login']).as('auth.login')
    router.post('/logout', [AuthController, 'logout']).as('auth.logout')
    router.post('/register', [AuthController, 'register']).as('auth.register')
  })
  .prefix('/auth')
