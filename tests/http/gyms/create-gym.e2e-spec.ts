import { app } from '@/app'
import { UnathorizedError } from '@/errors'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../create-auth-user'
import { cleanDb } from 'tests/setup-db'

describe('Create Gym (e2e) Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await cleanDb()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should throw UnathorizedError if not an admin user', async () => {
    const token = await createAndAuthenticateUser()
    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Gym Name',
        description: 'Gym Description',
        latitute: 0,
        longitude: 0,
        phone: null,
      })

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      message: new UnathorizedError().message,
    })
  })

  it('should create a new gym successfully', async () => {
    const token = await createAndAuthenticateUser('ADMIN')
    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Gym Name',
        description: 'Gym Description',
        latitude: 0,
        longitude: 0,
        phone: null,
      })
      .expect(201)

    expect(response.body).toEqual({
      gym: expect.objectContaining({
        name: 'Gym Name',
        description: 'Gym Description',
        latitude: 0,
        longitude: 0,
        phone: null,
      }),
    })
  })
})
