import { getNearbyGymsBodySchema } from '@/http/validations/gyms'
import { makeGetNearByGymsUsecase } from '@/use-cases/gyms/factories'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getNearbyGyms(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userLatitude, userLongitude } = getNearbyGymsBodySchema.parse(
    request.body,
  )
  const getNearByGymsUsecase = makeGetNearByGymsUsecase()
  const { gyms } = await getNearByGymsUsecase.handle({
    userLatitude,
    userLongitude,
  })
  return reply.status(200).send({ gyms })
}
