import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {

    const users = [{
      username: 'Admin',
      password: 'Admin',
    },{
      username: 'Damien',
      password: '1234',
    },{
      username: 'Guest',
      password: 'Guest',
    },
  ]

    await User.createMany(users)
  }
}