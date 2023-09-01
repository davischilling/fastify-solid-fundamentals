import { InvalidCredentialsError } from '@/errors'
import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma/users'
import { UserRepositoryInterface } from '@/repositories/user-repository.interface'
import { UserAuthenticateUsecase } from '@/use-cases/users'
import { hash } from 'bcryptjs'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('UserAuthenticateUsecase Integration Tests', () => {
  let usersRepo: UserRepositoryInterface
  let sut: UserAuthenticateUsecase
  const deleteUsers = prisma.user.deleteMany()

  beforeAll(() => {
    usersRepo = new PrismaUsersRepository()
  })

  beforeEach(async () => {
    await prisma.$transaction([deleteUsers])
    sut = new UserAuthenticateUsecase(usersRepo)
  })

  it('should throw InvalidCredentialsError if user does not exist', async () => {
    await expect(
      sut.handle({
        email: 'email@test.com',
        password: '123456',
      }),
    ).rejects.toThrow(new InvalidCredentialsError())
  })

  it("should throw InvalidCredentialsError if passwords don't match", async () => {
    const password = '123456'
    const password_hash = await hash(password, 6)
    await usersRepo.create({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash,
    })
    await expect(
      sut.handle({
        email: 'email@test.com',
        password: '1234567',
      }),
    ).rejects.toThrow(new InvalidCredentialsError())
  })

  it('should authenticate and return user successfully', async () => {
    const password = '123456'
    const password_hash = await hash(password, 6)
    await usersRepo.create({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash,
    })
    const { user } = await sut.handle({
      email: 'email@test.com',
      password,
    })
    expect(user).toMatchObject({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash,
    })
  })
})
