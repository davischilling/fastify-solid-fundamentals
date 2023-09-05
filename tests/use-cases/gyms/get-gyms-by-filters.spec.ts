import { prisma } from '@/lib/prisma'
import { GymRepositoryInterface, PrismaGymsRepository } from '@/repositories'
import { GetGymsByFiltersUsecase } from '@/use-cases/gyms'
import { cleanDb } from 'tests/setup-db'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('GetGymsByFiltersUsecase Integration Tests', () => {
  let gymsRepo: GymRepositoryInterface
  let sut: GetGymsByFiltersUsecase
  const deleteCheckIns = prisma.checkIn.deleteMany()
  const deleteGyms = prisma.gym.deleteMany()

  beforeAll(() => {
    gymsRepo = new PrismaGymsRepository()
  })

  beforeEach(async () => {
    sut = new GetGymsByFiltersUsecase(gymsRepo)
    await cleanDb()

    const gymList = [
      {
        name: 'Gym Name',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
      {
        name: 'Gym Name 2',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
      {
        name: 'Gym Name 3',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
    ]
    const promises: unknown[] = []
    gymList.forEach((gym) => promises.push(gymsRepo.create(gym)))
    await Promise.all(promises)
  })

  it('should return an empty array if there are no gyms registered', async () => {
    await prisma.$transaction([deleteCheckIns, deleteGyms])
    const { gyms } = await sut.handle({
      filters: { name: 'Gym Name' },
      page: 1,
    })
    expect(gyms).toEqual([])
  })

  it('should return an empty array if filters do not match any gym', async () => {
    const { gyms } = await sut.handle({
      filters: { name: 'any Name' },
    })
    expect(gyms).toEqual([])
  })

  it('should return all gyms if there are no filters', async () => {
    const { gyms } = await sut.handle({})
    expect(gyms).toEqual([
      {
        id: expect.any(String),
        name: 'Gym Name',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
      {
        id: expect.any(String),
        name: 'Gym Name 2',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
      {
        id: expect.any(String),
        name: 'Gym Name 3',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
    ])
  })

  it('should return an array of gyms if filters match any gym', async () => {
    const { gyms } = await sut.handle({
      filters: { name: 'Gym Name' },
    })
    expect(gyms).toEqual([
      {
        id: expect.any(String),
        name: 'Gym Name',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
      {
        id: expect.any(String),
        name: 'Gym Name 2',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
      {
        id: expect.any(String),
        name: 'Gym Name 3',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
    ])
  })

  it('should return an array of gyms ordered by name asc', async () => {
    const { gyms } = await sut.handle({
      filters: { name: 'Gym Name' },
      orderBy: { name: 'asc' },
    })
    expect(gyms).toEqual([
      {
        id: expect.any(String),
        name: 'Gym Name',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
      {
        id: expect.any(String),
        name: 'Gym Name 2',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
      {
        id: expect.any(String),
        name: 'Gym Name 3',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
    ])
  })

  it('should return an array of gyms ordered by name desc', async () => {
    const { gyms } = await sut.handle({
      filters: { name: 'Gym Name' },
      orderBy: { name: 'desc' },
    })
    expect(gyms).toEqual([
      {
        id: expect.any(String),
        name: 'Gym Name 3',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
      {
        id: expect.any(String),
        name: 'Gym Name 2',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
      {
        id: expect.any(String),
        name: 'Gym Name',
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      },
    ])
  })

  it('should return an array of gyms ordered by name asc and paginated', async () => {
    await prisma.$transaction([deleteCheckIns, deleteGyms])
    let aux = 1
    const promises = []
    for (let i = 0; i < 25; i++) {
      promises.push(
        gymsRepo.create({
          name: `Gym Name ${aux}`,
          latitude: 0,
          longitude: 0,
        }),
      )
      aux++
    }
    await Promise.all(promises)

    const { gyms: firstPageGyms } = await sut.handle({
      page: 1,
    })
    expect(firstPageGyms.length).toBe(20)

    const { gyms: secondPageGyms } = await sut.handle({
      page: 2,
    })
    expect(secondPageGyms.length).toBe(5)
  })
})
