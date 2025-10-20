import { FastifyReply, FastifyRequest } from 'fastify'

export async function CheckSessionIdExist(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = req.cookies.session_id

  if (!sessionId) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
}
