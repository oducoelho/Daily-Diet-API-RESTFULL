import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function mealRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const sessionId = request.cookies.sessionId

    const meals = await knex('meals').where('sessionId', sessionId).select('*')

    return {
      meals,
    }
  })

  app.get('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string(),
    })

    const meal = getMealParamsSchema.parse(request.params)

    const { id } = meal
    const sessionId = request.cookies.sessionId

    const meals = await knex('meals')
      .where({
        session_id: sessionId,
        id,
      })
      .select('*')

    return {
      meals,
    }
  })

  app.post('/', async (request, reply) => {
    const createMealBodyShema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.string(),
    })

    const meal = createMealBodyShema.safeParse(request.body)

    if (!meal.success) {
      return reply.status(400).send({
        message: meal.error.format(),
      })
    }

    const sessionId = request.cookies.sessionId

    const { name, isDiet, description } = meal.data

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      is_diet: isDiet.toLocaleLowerCase() === 'true',
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.put('/', async (request, reply) => {
    const putMealParamsSchema = z.object({
      id: z.string(),
    })

    const updateMealBodyShema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.string(),
    })

    const updateMeal = updateMealBodyShema.safeParse(request.body)

    if (!updateMeal.success) {
      return reply.status(400).send({
        message: updateMeal.error.format(),
      })
    }

    const meal = putMealParamsSchema.parse(request.params)
    const { id } = meal
    const { description, isDiet, name } = updateMeal.data

    const data = await knex('meals')
      .where('id', id)
      .update({
        name,
        description,
        is_diet: isDiet.toLocaleLowerCase() === 'true',
        updated_at: new Date().toDateString(),
      })

    if (!data) {
      return reply.status(404).send()
    }
    return reply.status(204).send()
  })
}
