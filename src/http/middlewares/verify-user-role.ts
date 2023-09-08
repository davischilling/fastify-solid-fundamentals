import { FastifyReply, FastifyRequest } from 'fastify'

type RoleTypes = 'ADMIN' | 'MEMBER'

export function verifyUserRole(rolesToVerify: RoleTypes[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user
    if (rolesToVerify.includes(role)) {
      return reply.status(401).send({ message: 'Unauthorized' })
    }
  }
}
