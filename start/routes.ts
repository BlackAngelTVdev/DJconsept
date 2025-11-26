/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import DonationObjectsController from '#controllers/donation_objects_controller'
import auth from '@adonisjs/auth/services/main'

router.get('/login', '#controllers/auth_controller.login')
router.post('/login', '#controllers/auth_controller.authenticate')
router.get('/', ({ view }) => view.render('pages/login'))
router.get('/account', '#controllers/accounts_controller.account')


router.get('home', [DonationObjectsController, 'index'])
router.get('new', [DonationObjectsController, 'create'])
router.get('item/:id', [DonationObjectsController, 'show']).as('donation_objects.show')
router.get('item/:id/edit', [DonationObjectsController, 'edit'])

router.post('items', [DonationObjectsController, 'store'])
router.post('item/:id', [DonationObjectsController, 'update']).as('donation_objects.update')
router.delete('item/:id', [DonationObjectsController, 'destroy'])

