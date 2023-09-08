import { UnathorizedError } from '@/errors'
import { FastifyRequest } from 'fastify'

type RoleTypes = 'ADMIN' | 'MEMBER'

export function verifyUserRole(rolesToVerify: RoleTypes[]) {
  return async (request: FastifyRequest) => {
    const { role } = request.user
    if (!rolesToVerify.includes(role)) {
      throw new UnathorizedError()
    }
  }
}
