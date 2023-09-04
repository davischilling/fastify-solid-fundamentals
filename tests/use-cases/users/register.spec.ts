import { UserAlreadyExistsError } from '@/errors'
import { PrismaUsersRepository } from '@/repositories/prisma/users'
import { UserRepositoryInterface } from '@/repositories/user-repository.interface'
import { UserRegisterUsecase } from '@/use-cases/users'
import bcryptjs from 'bcryptjs'
import { cleanDb } from 'tests/setup-db'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

describe('UserRegisterUsecase Integration Tests', () => {
  let usersRepo: UserRepositoryInterface
  let sut: UserRegisterUsecase

  beforeAll(() => {
    usersRepo = new PrismaUsersRepository()
  })

  beforeEach(async () => {
    sut = new UserRegisterUsecase(usersRepo)
  })

  afterEach(async () => {
    await cleanDb()
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
