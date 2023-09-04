import { prisma } from '@/lib/prisma'
import { GymRepositoryInterface, PrismaGymsRepository } from '@/repositories'
import { GetNearByGymsUsecase } from '@/use-cases/gyms'
import { cleanDb } from 'tests/setup-db'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('GetNearByGymsUsecase Integration Tests', () => {
  let gymsRepo: GymRepositoryInterface
  let sut: GetNearByGymsUsecase
  const deleteCheckIns = prisma.checkIn.deleteMany()
  const deleteGyms = prisma.gym.deleteMany()

  beforeAll(() => {
    gymsRepo = new PrismaGymsRepository()
  })

  beforeEach(async () => {
    sut = new GetNearByGymsUsecase(gymsRepo)
    let aux = 1
    const promises = []
    for (let i = 0; i < 25; i++) {
      promises.push(
        gymsRepo.create({
          name: `Gym Name ${aux}`,
          latitude: -21.756966,
          longitude: -41.332126,
        }),
      )
      aux++
    }
    await Promise.all(promises)
  })

  afterEach(async () => {
    await cleanDb()
  })

  it('should return an empty array if there are no gyms registered', async () => {
    await prisma.$transaction([deleteCheckIns, deleteGyms])
    const { gyms } = await sut.handle({
      userLatitude: 0,
      userLongitude: 0,
    })
    expect(gyms).toEqual([])
  })

  it('should return an empty array if no gyms 10 kilometers distance', async () => {
    const { gyms } = await sut.handle({
      userLatitude: 41.967009,
      userLongitude: 12.513615,
    })
    expect(gyms).toEqual([])
  })

  it('should return all gyms in 10 kilometers', async () => {
    const { gyms } = await sut.handle({
      userLatitude: -21.755524,
      userLongitude: -41.332787,
    })
    expect(gyms).toHaveLength(25)
  })
})
