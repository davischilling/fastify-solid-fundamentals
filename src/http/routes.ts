import { FastifyInstance } from 'fastify'
import { register } from './controllers/users/register'
import { authenticate } from './controllers/users/authenticate'
import { profile } from './controllers/users'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return { hello: 'world' }
  })

  app.post('/users', register)
  app.post('/sessions', authenticate)

  /** Authenticated routes */
  app.get(
    '/me',
    {
      onRequest: [verifyJWT],
    },
    profile,
  )
}
