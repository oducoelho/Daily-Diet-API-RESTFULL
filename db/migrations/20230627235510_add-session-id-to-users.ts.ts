import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.uuid('session_id').after('created_at').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('session_id')
  })
}
