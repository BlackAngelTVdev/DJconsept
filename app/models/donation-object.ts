import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm' 
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class DonationObject extends BaseModel {

  public static $fillable = ['name', 'description', 'type', 'status', 'categorie', 'user_id'];

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number // Correspond à 'user_id' dans la base de données

  @column()
  declare name: string | null

  @column()
  declare description: string | null

  @column()
  declare type: boolean

  @column()
  declare status: number

  @column()
  declare categorie: string | null

  /**
   * ⬅️ Propriété pour l'image en Base64
   */
  @column({ serializeAs: 'image_base_64' }) // ⬅️ Utilise l'alias 'image_base_64' pour la base de données
  declare imageBase64: string | null // Correspond à 'image_base_64' dans la base de données


  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}