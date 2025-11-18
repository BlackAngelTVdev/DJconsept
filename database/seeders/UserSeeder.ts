import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {

    const users = [{
      username: 'Admin',
      password: 'Admin',
    }]

    await User.createMany(users)
  }
}