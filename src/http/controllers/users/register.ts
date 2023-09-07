import { UserAlreadyExistsError } from '@/errors'
import { registerBodySchema } from '@/http/validations/users'
import { makeRegisterUseCase } from '@/use-cases/users/factories'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const userRegisterUsecase = makeRegisterUseCase()
    await userRegisterUsecase.handle({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }

  reply.status(201).send()
}
