import {
  MaxDistanceError,
  MaxNumberOfCheckInsError,
  ResourceNotFoundError,
} from '@/errors'
import { createCheckInBodySchema } from '@/http/validations/check-ins'
import { makeCreateCheckInUseCase } from '@/use-cases/check-ins/fatories'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function createCheckIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const checkInInput = createCheckInBodySchema.parse(request.body)

  try {
    const createCheckInUseCase = makeCreateCheckInUseCase()
    const { checkIn } = await createCheckInUseCase.handle(checkInInput)
    reply.status(201).send({ checkIn })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    } else if (
      err instanceof MaxDistanceError ||
      err instanceof MaxNumberOfCheckInsError
    ) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }
}
