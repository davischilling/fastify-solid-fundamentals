import { ResourceNotFoundError } from '@/errors'
import { getUserCheckInsHistoryBodySchema } from '@/http/validations/check-ins'
import { makeGetUserCheckInsHistoryUsecase } from '@/use-cases/check-ins/fatories'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getUserCheckInsHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId, page } = getUserCheckInsHistoryBodySchema.parse(request.body)

  try {
    const getUserCheckInsHistoryUsecase = makeGetUserCheckInsHistoryUsecase()
    const { checkIns } = await getUserCheckInsHistoryUsecase.handle({
      userId,
      page,
    })
    reply.status(200).send({ checkIns })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
