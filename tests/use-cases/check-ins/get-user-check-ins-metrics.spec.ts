import { ResourceNotFoundError } from '@/errors'
import {
  CheckInRepositoryInterface,
  GymRepositoryInterface,
  PrismaCheckInsRepository,
  PrismaGymsRepository,
  PrismaUsersRepository,
  UserRepositoryInterface,
} from '@/repositories'
import { GetUserCheckInsMetricsUsecase } from '@/use-cases/check-ins'
import { Gym, User } from '@prisma/client'
import { hash } from 'bcryptjs'
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

describe('GetUserCheckInsMetricsUsecase Integration Tests', () => {
  let checkInsRepo: CheckInRepositoryInterface
  let usersRepo: UserRepositoryInterface
  let gymsRepo: GymRepositoryInterface
  let sut: GetUserCheckInsMetricsUsecase

  let createdUser: User
  let createdGym: Gym

  beforeAll(async () => {
    checkInsRepo = new PrismaCheckInsRepository()
    usersRepo = new PrismaUsersRepository()
    gymsRepo = new PrismaGymsRepository()
  })

  beforeEach(async () => {
    vi.useFakeTimers()
    sut = new GetUserCheckInsMetricsUsecase(usersRepo, checkInsRepo)
    await cleanDb()

    const password = '123456'
    const password_hash = await hash(password, 6)
    createdUser = await usersRepo.create({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash,
    })
    createdGym = await gymsRepo.create({
      name: 'Gym Name',
      latitude: 0,
      longitude: 0,
    })
  })

  afterEach(async () => {
    vi.useRealTimers()
  })

  it('should throw ResourceNotFoundError if user does not exist', async () => {
    await expect(
      sut.handle({
        userId: 'userId',
      }),
    ).rejects.toThrow(new ResourceNotFoundError())
  })

  it('should be able to get checkIns metrics successfully', async () => {
    for (let i = 0; i < 32; i++) {
      await checkInsRepo.create({
        gym_id: createdGym.id,
        user_id: createdUser.id,
      })
    }
    const { checkInsCount } = await sut.handle({
      userId: createdUser.id,
    })
    expect(checkInsCount).toBe(32)
  })
})
