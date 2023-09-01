import { InvalidCredentialsError } from '@/errors'
import { makeAuthenticateUseCase } from '@/factories/use-cases/users'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const userAuthenticateUsecase = makeAuthenticateUseCase()
    const { user } = await userAuthenticateUsecase.handle({ email, password })
    return reply.status(200).send({ user })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
