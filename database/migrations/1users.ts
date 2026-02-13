import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.boolean('is_admin').notNullable().defaultTo(false)

      table.string('location').nullable()
      table.float('latitude').nullable()
      table.float('longitude').nullable()
      table.integer('price_per_gig').nullable()

      // Correction ici : snake_case
      table.integer('travel_range').nullable()
      table.boolean('is_dj').notNullable().defaultTo(false)

      table.string('instagram_url').nullable()
      table.string('tiktok_url').nullable()
      table.string('youtube_url').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
