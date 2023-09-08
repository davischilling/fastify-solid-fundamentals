import { FastifyInstance } from 'fastify'
import { register } from './controllers/users/register'
import { authenticate } from './controllers/users/authenticate'
import { profile, refresh } from './controllers/users'
import { verifyJWT } from './middlewares/verify-jwt'
import {
  createCheckIn,
  getUserCheckInsHistory,
  getUserCheckInsMetrics,
  validateCheckIn,
} from './controllers/check-ins'
import { createGym, getGymsByFilter, getNearbyGyms } from './controllers/gyms'
import { verifyUserRole } from './middlewares/verify-user-role'

export async function appRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return { hello: 'world' }
  })

  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refresh)

  /** Authenticated routes -> user */
  app.get(
    '/me',
    {
      onRequest: [verifyJWT],
    },
    profile,
  )

  /** Authenticated routes -> checkIn */
  app.post(
    '/check-ins',
    {
      onRequest: [verifyJWT],
    },
    createCheckIn,
  )
  app.get(
    '/check-ins/history',
    {
      onRequest: [verifyJWT],
    },
    getUserCheckInsHistory,
  )
  app.get(
    '/check-ins/metrics',
    {
      onRequest: [verifyJWT],
    },
    getUserCheckInsMetrics,
  )
  app.post(
    '/check-ins/validate',
    {
      onRequest: [verifyJWT, verifyUserRole(['ADMIN'])],
    },
    validateCheckIn,
  )

  /** Authenticated routes -> gyms */
  app.post(
    '/gyms',
    {
      onRequest: [verifyJWT, verifyUserRole(['ADMIN'])],
    },
    createGym,
  )
  app.get(
    '/gyms',
    {
      onRequest: [verifyJWT],
    },
    getGymsByFilter,
  )
  app.get(
    '/gyms/nearby',
    {
      onRequest: [verifyJWT],
    },
    getNearbyGyms,
  )
}
