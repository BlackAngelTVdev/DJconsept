/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import DonationObjectsController from '#controllers/donation_objects_controller'
import router from '@adonisjs/core/services/router'




router.get('home', [DonationObjectsController, 'index'])
router.get('new', [DonationObjectsController, 'create'])
router.get('item/:id', [DonationObjectsController, 'show'])
router.post('item', [DonationObjectsController, 'store'])

