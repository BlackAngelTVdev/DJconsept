import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {

    await User.create({
      fullName: 'Damien Rochat',
      email: 'dami.scoo3@gmail.com',
      password: 'Tw4t2LuRq!'
    })
  }
}