import { knex as setupKnex } from 'knex'

export const knex = setupKnex({
  client: sqlite,
})
