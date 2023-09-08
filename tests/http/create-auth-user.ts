import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export const createAndAuthenticateUser = async (
  role: 'ADMIN' | 'MEMBER' = 'MEMBER',
): Promise<string> => {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'email@mail.com',
      password_hash: await hash('123456', 6),
      role,
    },
  })
  const response = await request(app.server).post('/sessions').send({
    email: 'email@mail.com',
    password: '123456',
  })
  const { token } = response.body
  return token
}
