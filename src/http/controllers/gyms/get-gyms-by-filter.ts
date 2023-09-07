import { getGymsbyFiltersBodySchema } from '@/http/validations/gyms'
import { makeGetGymsByFiltersUsecase } from '@/use-cases/gyms/factories'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getGymsByFilter(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { filters, orderBy, page } = getGymsbyFiltersBodySchema.parse(
    request.body,
  )
  const getUserProfileUseCase = makeGetGymsByFiltersUsecase()
  const { gyms } = await getUserProfileUseCase.handle({
    filters,
    orderBy,
    page,
  })
  return reply.status(200).send({ gyms })
}
