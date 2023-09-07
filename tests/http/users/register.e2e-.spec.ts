import { afterAll, beforeAll, describe, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Register (e2e) Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register successfully', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'email@mail.com',
        password: '123456',
      })
      .expect(201)
  })
})
