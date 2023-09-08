import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { UserAlreadyExistsError } from '@/errors'
import { cleanDb } from 'tests/setup-db'

describe('Register (e2e) Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await cleanDb()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should throw UserAlreadyExistsError if user already registered', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'email@mail.com',
      password: '123456',
    })

    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'email@mail.com',
      password: '123456',
    })

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      message: new UserAlreadyExistsError().message,
    })
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
