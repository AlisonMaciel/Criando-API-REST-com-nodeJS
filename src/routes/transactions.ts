import { FastifyInstance } from 'fastify'
import { db } from '../database.ts'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { CheckSessionIdExist } from '../middlewares/check-session-id-exist.ts'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [CheckSessionIdExist],
    },
    async (req) => {
      const sessionId = req.cookies.session_id
      const transactions = await db('transactions')
        .where('session_id', sessionId)
        .select()

      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [CheckSessionIdExist],
    },
    async (req) => {
      const getTransactionsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionsParamsSchema.parse(req.params)

      const sessionId = req.cookies.session_id

      const transactions = await db('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { transactions }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [CheckSessionIdExist],
    },
    async (req) => {
      const sessionId = req.cookies.session_id
      const summary = await db('transactions')
        .sum('amount', {
          as: 'amount',
        })
        .where('session_id', sessionId)
        .first()

      return { summary }
    },
  )

  app.post('/', async (req, reply) => {
    const createTransactionsBodySchema = z.object({
      title: z.string(),
      amount: z.coerce.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { amount, title, type } = createTransactionsBodySchema.parse(req.body)

    let sessionId = req.cookies.session_id

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('session_id', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await db('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
