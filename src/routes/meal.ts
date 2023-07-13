import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function mealRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const sessionId = request.cookies.sessionId

    const meals = await knex('meals').where('sessionId', sessionId).select('*')

    return {
      meals,
    }
  })
}
