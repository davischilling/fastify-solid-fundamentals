import {
  MaxDistanceError,
  MaxNumberOfCheckInsError,
  ResourceNotFoundError,
} from '@/errors'
import {
  CheckInRepositoryInterface,
  GymRepositoryInterface,
  PrismaCheckInsRepository,
  PrismaGymsRepository,
  PrismaUsersRepository,
  UserRepositoryInterface,
} from '@/repositories'
import { CreateCheckInUseCase } from '@/use-cases/check-ins'
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

describe('CreateCheckInUseCase Integration Tests', () => {
  let checkInsRepo: CheckInRepositoryInterface
  let gymsRepo: GymRepositoryInterface
  let usersRepo: UserRepositoryInterface
  let sut: CreateCheckInUseCase

  beforeAll(() => {
    checkInsRepo = new PrismaCheckInsRepository()
    gymsRepo = new PrismaGymsRepository()
    usersRepo = new PrismaUsersRepository()
  })

  beforeEach(async () => {
    vi.useFakeTimers()
    sut = new CreateCheckInUseCase(checkInsRepo, gymsRepo, usersRepo)
    await cleanDb()
  })

  afterEach(async () => {
    vi.useRealTimers()
  })

  it('should throw ResourceNotFoundError if user does not exist', async () => {
    await expect(
      sut.handle({
        gymId: 'gymId',
        userId: 'userId',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toThrow(new ResourceNotFoundError())
  })

  it('should throw ResourceNotFoundError if gym does not exist', async () => {
    const password = '123456'
    const password_hash = await hash(password, 6)
    const createdUser = await usersRepo.create({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash,
    })
    await expect(
      sut.handle({
        gymId: 'gymId',
        userId: createdUser.id,
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toThrow(new ResourceNotFoundError())
  })

  it('should not be able to make more than one checkIn per day', async () => {
    vi.setSystemTime(new Date())
    const password = '123456'
    const password_hash = await hash(password, 6)
    const createdUser = await usersRepo.create({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash,
    })
    const createdGym = await gymsRepo.create({
      name: 'Gym Name',
      latitude: 0,
      longitude: 0,
    })
    await sut.handle({
      gymId: createdGym.id,
      userId: createdUser.id,
      userLatitude: 0,
      userLongitude: 0,
    })
    await expect(
      sut.handle({
        gymId: createdGym.id,
        userId: createdUser.id,
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toThrow(new MaxNumberOfCheckInsError())
  })

  it('should not be able to checkIn on a distant gym', async () => {
    const password = '123456'
    const password_hash = await hash(password, 6)
    const createdUser = await usersRepo.create({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash,
    })
    const createdGym = await gymsRepo.create({
      name: 'Gym Name',
      latitude: -21.757051,
      longitude: -41.331502,
    })
    await expect(
      sut.handle({
        gymId: createdGym.id,
        userId: createdUser.id,
        userLatitude: -21.764458,
        userLongitude: -41.325223,
      }),
    ).rejects.toThrow(new MaxDistanceError())
  })

  it('should be able to checkIn successfully', async () => {
    const password = '123456'
    const password_hash = await hash(password, 6)
    const createdUser = await usersRepo.create({
      name: 'John Doe',
      email: 'email@test.com',
      password_hash,
    })
    const createdGym = await gymsRepo.create({
      name: 'Gym Name',
      latitude: 0,
      longitude: 0,
    })
    const { checkIn } = await sut.handle({
      gymId: createdGym.id,
      userId: createdUser.id,
      userLatitude: 0,
      userLongitude: 0,
    })
    expect(checkIn).toMatchObject({
      id: expect.any(String),
      created_at: expect.any(Date),
      gym_id: createdGym.id,
      user_id: createdUser.id,
    })
  })
})
