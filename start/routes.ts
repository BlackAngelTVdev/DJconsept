
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
router.on('/login').render('pages/users/login').as('login')
router.on('/register').render('pages/users/register').as('register')


/*
|--------------------------------------------------------------------------
| Espace Membres (CRUD Users)
|--------------------------------------------------------------------------
| On groupe ici tout ce qui demande d'être connecté.
| Pour l'instant on ne met pas de middleware, on prépare juste la structure.
*/
router.group(() => {
  router.get('/users', [UsersController, 'index']).as('users.index')
  router.get('/users/:id', [UsersController, 'show']).as('users.show')
  router.get('/users/:id/edit', [UsersController, 'edit']).as('users.edit')
  router.put('/users/:id', [UsersController, 'update']).as('users.update')
  router.delete('/users/:id', [UsersController, 'destroy']).as('users.destroy')
  router.get('/users/:id/secure/edit', [UsersController, 'editSecure']).as('users.secure.edit')
  router.patch('users/:id/security', [UsersController, 'updateSecurity']).as('users.updateSecurity').use(middleware.auth())
}).prefix('/log').use(middleware.auth())

router.group(() => {
  router.post('/login', [AuthController, 'login']).as('auth.login')
  router.post('/logout', [AuthController, 'logout']).as('auth.logout')
  router.post('/register', [AuthController, 'register']).as('auth.register')

}).prefix('/auth')