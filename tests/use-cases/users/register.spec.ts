import { UserAlreadyExistsError } from '@/errors'
import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma/users'
import { RepositoryInterface } from '@/repositories/repository.interface'
import { UserRegisterUsecase } from '@/use-cases/users'
import bcryptjs from 'bcryptjs'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

describe('UserRegisterUsecase Unit Tests', () => {
  let usersRepo: RepositoryInterface
  let sut: UserRegisterUsecase
  const deleteUsers = prisma.user.deleteMany()

  beforeAll(() => {
    usersRepo = new PrismaUsersRepository()
  })

  beforeEach(async () => {
    await prisma.$transaction([deleteUsers])
    sut = new UserRegisterUsecase(usersRepo)
  })

  it('should hash user password upon registration', async () => {
    const hash = vi
      .spyOn(bcryptjs, 'hash')
      .mockImplementationOnce(async () => 'hashed')
    const repoCreateSpy = vi.spyOn(usersRepo, 'create')
    await sut.handle({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    })
    expect(hash).toHaveBeenCalledWith('123456', 6)
    expect(hash).toHaveBeenCalledTimes(1)
    expect(repoCreateSpy).toBeCalledWith({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash: 'hashed',
    })
    expect(repoCreateSpy).toHaveBeenCalledTimes(1)
  })

  it('should throw UserAlreadyExistsError if user with same email already exists', async () => {
    await usersRepo.create({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash: 'hashed',
    })
    await expect(
      sut.handle({
        name: 'John Doe',
        email: 'email@test.com',
        password: '123456',
      }),
    ).rejects.toThrow(new UserAlreadyExistsError())
  })

  it('should register user successfully', async () => {
    const hash = vi
      .spyOn(bcryptjs, 'hash')
      .mockImplementationOnce(async () => 'hashed')
    const repoCreateSpy = vi.spyOn(usersRepo, 'create')
    await sut.handle({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    })
    const user = await usersRepo.findByEmail('email@test.com')
    expect(user).toMatchObject({
      id: expect.any(String),
      name: 'John Doe',
      email: 'email@test.com',
      password_hash: 'hashed',
      created_at: expect.any(Date),
    })
    expect(hash).toHaveBeenCalledWith('123456', 6)
    expect(hash).toHaveBeenCalledTimes(1)
    expect(repoCreateSpy).toBeCalledWith({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash: 'hashed',
    })
    expect(repoCreateSpy).toHaveBeenCalledTimes(1)
  })
})
