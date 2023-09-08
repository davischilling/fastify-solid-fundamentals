import { app } from '@/app'
import { InvalidCredentialsError } from '@/errors'
import request from 'supertest'
import { cleanDb } from 'tests/setup-db'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Authenticate (e2e) Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await cleanDb()
  })

  afterAll(async () => {
    await app.close()
  })

  const createUser = async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'email@mail.com',
      password: '123456',
    })
  }

  it('should throw InvalidCredentialsError if user does not exist', async () => {
    const response = await request(app.server).post('/sessions').send({
      email: 'email@mail.com',
      password: '123456',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: new InvalidCredentialsError().message,
    })
  })

  it('should throw InvalidCredentialsError if wrong password', async () => {
    await createUser()
    const response = await request(app.server).post('/sessions').send({
      email: 'email@mail.com',
      password: '12345',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: new InvalidCredentialsError().message,
    })
  })

  it('should throw InvalidCredentialsError if wrong email', async () => {
    await createUser()
    const response = await request(app.server).post('/sessions').send({
      email: 'email@maill.com',
      password: '123456',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: new InvalidCredentialsError().message,
    })
  })

  it('should be able to authenticate successfully', async () => {
    await createUser()
    const response = await request(app.server).post('/sessions').send({
      email: 'email@mail.com',
      password: '123456',
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
