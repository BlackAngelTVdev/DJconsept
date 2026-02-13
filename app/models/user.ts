import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare isAdmin: boolean

  /* --- Infos Prestation --- */

  @column()
  declare location: string | null

  @column()
  declare latitude: number | null

  @column()
  declare longitude: number | null

  @column()
  declare travelRange: number | null

  @column()
  declare pricePerGig: number | null

  @column()
  declare isDj: boolean

  /* --- Réseaux Sociaux --- */

  @column()
  declare instagramUrl: string | null

  @column()
  declare tiktokUrl: string | null

  @column()
  declare youtubeUrl: string | null

  /* --- Timestamps --- */

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
