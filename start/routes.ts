/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import auth from '#middleware/auth_middleware'

router.get('/login', '#controllers/auth_controller.login')
router.post('/login', '#controllers/auth_controller.authenticate')
router.get('/', ({ view }) => view.render('pages/login'))

router.get('/home', ({ view }) => view.render('pages/home'))