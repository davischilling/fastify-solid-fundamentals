import { ResourceNotFoundError } from '@/errors'
import { PrismaUsersRepository } from '@/repositories/prisma/users'
import { UserRepositoryInterface } from '@/repositories/user-repository.interface'
import { GetUserProfileUsecase } from '@/use-cases/users'
import { hash } from 'bcryptjs'
import { cleanDb } from 'tests/setup-db'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('GetUserProfileUsecase Integration Tests', () => {
  let usersRepo: UserRepositoryInterface
  let sut: GetUserProfileUsecase

  beforeAll(() => {
    usersRepo = new PrismaUsersRepository()
  })

  beforeEach(async () => {
    sut = new GetUserProfileUsecase(usersRepo)
  })

  afterEach(async () => {
    await cleanDb()
  })

  it('should throw ResourceNotFoundError if user does not exist', async () => {
    await expect(
      sut.handle({
        userId: '123456',
      }),
    ).rejects.toThrow(new ResourceNotFoundError())
  })

  it('should return user profile successfully', async () => {
    const password = '123456'
    const password_hash = await hash(password, 6)
    const createdUser = await usersRepo.create({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash,
    })
    const { user } = await sut.handle({
      userId: createdUser.id,
    })
    expect(user).toMatchObject({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash,
    })
  })
})
