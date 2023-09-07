import { ResourceNotFoundError } from '@/errors'
import { getUserCheckInsMetricsBodySchema } from '@/http/validations/check-ins'
import { makeGetUserCheckInsMetricsUsecase } from '@/use-cases/check-ins/fatories'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getUserCheckInsMetrics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId } = getUserCheckInsMetricsBodySchema.parse(request.body)

  try {
    const getUserCheckInsMetricsUsecase = makeGetUserCheckInsMetricsUsecase()
    const { checkInsCount } = await getUserCheckInsMetricsUsecase.handle({
      userId,
    })
    reply.status(200).send({ checkInsCount })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
