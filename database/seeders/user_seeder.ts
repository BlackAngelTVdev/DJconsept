import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // On utilise createMany pour aller plus vite
    await User.createMany([
      {
        fullName: 'DJ Dam\'s',
        email: 'dami.scoo3@gmail.com',
        password: 'Tw4t2LuRq!',
      },
      {
        fullName: 'Sarah Mendoza',
        email: 'sarah.m@electro-pulse.ch',
        password: 'Password123!',
      },
      {
        fullName: 'Marc Voisin',
        email: 'marc.voisin@booking-agency.fr',
        password: 'Password123!',
      },
      {
        fullName: 'Lucas ‘Dj Sky’ Dupont',
        email: 'sky.dj@gmail.com',
        password: 'Password123!',
      },
      {
        fullName: 'Damien Rochat',
        email: 'admin@djconsept.fr',
        password: 'admin',
        isAdmin: true
      }
    ])
  }
}