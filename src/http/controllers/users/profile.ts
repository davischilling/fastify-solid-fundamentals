import { ResourceNotFoundError } from '@/errors'
import { makeGetUserProfileUseCase } from '@/use-cases/users/factories'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserProfileUseCase = makeGetUserProfileUseCase()
    const { user } = await getUserProfileUseCase.handle({
      userId: request.user.sub,
    })
    return reply.status(200).send({ user })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
