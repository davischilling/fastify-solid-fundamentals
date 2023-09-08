import { app } from '@/app'
import { UnathorizedError } from '@/errors'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../create-auth-user'
import { cleanDb } from 'tests/setup-db'

describe('Profile (e2e) Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await cleanDb()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should throw UnathorizedError if token is invalid or not present', async () => {
    const response = await request(app.server).get('/me')

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      message: new UnathorizedError().message,
    })
  })

  it('should get profile successfully', async () => {
    const token = await createAndAuthenticateUser()
    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        email: 'email@mail.com',
      }),
    })
  })
})
