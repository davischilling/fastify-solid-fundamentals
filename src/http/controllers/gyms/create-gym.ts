import { createGymBodySchema } from '@/http/validations/gyms'
import { makeCreateGymUseCase } from '@/use-cases/gyms/factories'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function createGym(request: FastifyRequest, reply: FastifyReply) {
  const inputs = createGymBodySchema.parse(request.body)
  const createGymUseCase = makeCreateGymUseCase()
  const { gym } = await createGymUseCase.handle({
    ...inputs,
  })
  return reply.status(201).send({ gym })
}
