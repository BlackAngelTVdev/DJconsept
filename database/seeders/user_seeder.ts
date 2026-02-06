import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: "DJ Dam's",
        email: 'dj.dams08@gmail.com',
        password: 'Tw4t2LuRq!',
        location: 'Lausanne, CH',
        pricePerGig: 600,
        instagramUrl: 'https://www.instagram.com/dj_dams_official/',
        tiktokUrl: 'https://www.tiktok.com/@dj_dams',
        youtubeUrl: 'https://www.youtube.com/@djdams',
      },
      {
        fullName: 'Sarah Mendoza',
        email: 'sarah.m@electro-pulse.ch',
        password: 'Password123!',
        location: 'Genève, CH',
        pricePerGig: 450,
        instagramUrl: 'https://www.instagram.com/sarah_m_official',
        tiktokUrl: 'https://www.tiktok.com/@sarahmendoza',
      },
      {
        fullName: 'Marc Voisin',
        email: 'marc.voisin@booking-agency.fr',
        password: 'Password123!',
        location: 'Paris, FR',
        pricePerGig: 800,
        youtubeUrl: 'https://www.youtube.com/@marcvoisin_live',
      },
      {
        fullName: 'Lucas ‘Dj Sky’ Dupont',
        email: 'sky.dj@gmail.com',
        password: 'Password123!',
        location: 'Lyon, FR',
        pricePerGig: 350,
        instagramUrl: 'https://www.instagram.com/djsky_dupont',
        tiktokUrl: 'https://www.tiktok.com/@djsky',
      },
      {
        fullName: 'Damien Rochat',
        email: 'admin@djconsept.fr',
        password: 'admin',
        location: 'Morges',
        isAdmin: true,
        instagramUrl: 'https://www.instagram.com/dj_dams08',
        youtubeUrl:'https://www.youtube.com/@Dj-Dam-s',
      }
      ,
      {
        fullName: 'GM',
        email: 'gm@djconsept.fr',
        password: 'gmguest',
        location: 'Lausanne',
      },
      {
        fullName: 'Triple J',
        email: 'lael.emery@gmail.com',
        password: 'ChangeMe123',
        location: 'Morges',
        isAdmin: true,
      }
    ])
  }
}