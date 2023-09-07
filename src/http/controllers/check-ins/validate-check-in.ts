import { MaxTimeError, ResourceNotFoundError } from '@/errors'
import { ValidateCheckInBodySchema } from '@/http/validations/check-ins'
import { makeValidateCheckInUseCase } from '@/use-cases/check-ins/fatories'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function validateCheckIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { checkInId } = ValidateCheckInBodySchema.parse(request.body)

  try {
    const validateCheckInUseCase = makeValidateCheckInUseCase()
    const { checkIn } = await validateCheckInUseCase.handle({ checkInId })
    reply.status(200).send({ checkIn })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    } else if (err instanceof MaxTimeError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }
}
