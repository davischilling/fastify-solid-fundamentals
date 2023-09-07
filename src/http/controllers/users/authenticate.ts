import { InvalidCredentialsError } from '@/errors'
import { authenticateBodySchema } from '@/http/validations/users'
import { makeAuthenticateUseCase } from '@/use-cases/users/factories'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authenticateBodySchema.parse(request.body)
  try {
    const userAuthenticateUsecase = makeAuthenticateUseCase()
    const { user } = await userAuthenticateUsecase.handle({ email, password })
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )
    return reply.status(200).send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
