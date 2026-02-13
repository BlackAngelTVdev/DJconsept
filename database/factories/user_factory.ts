import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123', // Garde un truc simple pour tes tests
      isDj: faker.datatype.boolean({ probability: 0.8 }), // 80% de chance d'être DJ
      isAdmin: false,
      location: faker.location.city(),
      pricePerGig: faker.number.int({ min: 100, max: 2000 }),
      travelRange: faker.number.int({ min: 10, max: 100 }),

   
      latitude: faker.location.latitude({ max: 47.8, min: 45.8 }),
      longitude: faker.location.longitude({ max: 7.5, min: 5.9 }),

      instagramUrl: faker.internet.url(),
    }
  })
  .build()
