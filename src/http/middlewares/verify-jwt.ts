import { UnathorizedError } from '@/errors'
import { FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest) {
  try {
    await request.jwtVerify()
  } catch (e) {
    throw new UnathorizedError()
  }
}
