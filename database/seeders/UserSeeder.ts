import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/User'

export default class extends BaseSeeder {
  async run() {

    const users = [{
      username: 'Admin',
      password: 'Admin',
    }]

    await User.createMany(users)
  }
}