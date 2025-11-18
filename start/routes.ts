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

router.get('home', [DonationObjectsController, 'index'])
router.get('new', [DonationObjectsController, 'create'])
router.get('item/:id', [DonationObjectsController, 'show']).as('donation_objects.show')
router.get('item/:id/edit', [DonationObjectsController, 'edit']).as('donation_objects.edit')

router.post('items', [DonationObjectsController, 'store'])
router.put('item/:id', [DonationObjectsController, 'update']).as('donation_objects.update')
router.delete('item/:id', [DonationObjectsController, 'destroy'])