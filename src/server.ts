import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'crypto'

const app = fastify()

app.get('/hello', async () => {
  const user = await knex('users')
    .insert({
      id: randomUUID(),
      name: 'test',
    })
    .returning('*')

  return user
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is Runnning!')
  })
