import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm' 
// ⚠️ Plus besoin des imports de relations (hasMany, etc.)

export default class DonationObject extends BaseModel {
  public static $fillable = ['name', 'description', 'type','status', 'categorie'];
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare description: string | null
  
  @column()
  declare type: boolean
  
  @column()
  declare status: number // Type corrigé à 'number'

  @column()
  declare categorie: string | null

  /**
   * ⬅️ Propriété pour le chemin de l'image unique
   */
  @column({ serializeAs: 'image_base_64' }) // ⬅️ AJOUT DE serializeAs
  declare imageBase64: string | null // Correspond au 'image_path' nullable de la base de données

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}