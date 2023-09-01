import { UserAlreadyExistsError } from '@/errors'
import { PrismaUsersRepository } from '@/repositories/prisma/users'
import { UserRegisterUsecase } from '@/use-cases/users/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const userRepo = new PrismaUsersRepository()
    const userRegisterUsecase = new UserRegisterUsecase(userRepo)
    await userRegisterUsecase.handle({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }

  reply.status(201).send()
}
