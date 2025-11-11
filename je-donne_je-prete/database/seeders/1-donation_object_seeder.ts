import DonationObject from '#models/donation-object'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {

    const objects = [{
      name: 'Ballon de foot',
      description: 'Coupe du monde 2015',
    },{
      name: 'Ballon de basket',
      description: 'Coupe du monde 2015',
    } ]

    await DonationObject.createMany(objects)
  }
}