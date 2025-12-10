import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'donation_objects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users') 
            .onDelete('CASCADE') 
      table.string('name').nullable()
      table.string('description', 5000).nullable()
      table.boolean('type').notNullable()
      table.integer('status').notNullable().defaultTo(1)
      table.specificType('image_base_64', 'MEDIUMTEXT').nullable()
      table.string('categorie').defaultTo('aucune')
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}