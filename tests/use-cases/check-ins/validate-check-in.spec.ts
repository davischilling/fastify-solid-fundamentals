import { MaxTimeError, ResourceNotFoundError } from '@/errors'
import {
  CheckInRepositoryInterface,
  GymRepositoryInterface,
  PrismaCheckInsRepository,
  PrismaGymsRepository,
  PrismaUsersRepository,
  UserRepositoryInterface,
} from '@/repositories'
import { ValidateCheckInUseCase } from '@/use-cases/check-ins'
import { CheckIn, Gym, User } from '@prisma/client'
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

describe('ValidateCheckInUseCase Integration Tests', () => {
  let checkInsRepo: CheckInRepositoryInterface
  let gymsRepo: GymRepositoryInterface
  let usersRepo: UserRepositoryInterface
  let sut: ValidateCheckInUseCase

  let createdUser: User
  let createdGym: Gym
  let createdCheckIn: CheckIn

  beforeAll(() => {
    checkInsRepo = new PrismaCheckInsRepository()
    gymsRepo = new PrismaGymsRepository()
    usersRepo = new PrismaUsersRepository()
  })

  beforeEach(async () => {
    vi.useFakeTimers()
    sut = new ValidateCheckInUseCase(checkInsRepo)
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
    createdCheckIn = await checkInsRepo.create({
      gym_id: createdGym.id,
      user_id: createdUser.id,
    })
  })

  afterEach(async () => {
    vi.useRealTimers()
  })

  it('should throw ResourceNotFoundError if checkIn does not exist', async () => {
    await expect(
      sut.handle({
        checkInId: 'checkInId',
      }),
    ).rejects.toThrow(new ResourceNotFoundError())
  })

  it('should throw MaxTimeError if checkIn exceeds expiration time', async () => {
    const checkIn = await checkInsRepo.create({
      gym_id: createdGym.id,
      user_id: createdUser.id,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    })
    await expect(
      sut.handle({
        checkInId: checkIn.id,
      }),
    ).rejects.toThrow(new MaxTimeError())
  })

  it('should be able to validate checkIn successfully', async () => {
    expect(createdCheckIn).toMatchObject({
      id: expect.any(String),
      created_at: expect.any(Date),
      gym_id: createdGym.id,
      user_id: createdUser.id,
      validated_at: null,
    })
    const { checkIn } = await sut.handle({
      checkInId: createdCheckIn.id,
    })
    expect(checkIn).toMatchObject({
      id: expect.any(String),
      created_at: expect.any(Date),
      gym_id: createdGym.id,
      user_id: createdUser.id,
      validated_at: expect.any(Date),
    })
  })
})
