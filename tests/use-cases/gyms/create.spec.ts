import { GymRepositoryInterface, PrismaGymsRepository } from '@/repositories'
import { CreateGymUsecase, CreateGymUsecaseInput } from '@/use-cases/gyms'
import { cleanDb } from 'tests/setup-db'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('CreateGymUsecase Integration Tests', () => {
  let gymsRepo: GymRepositoryInterface
  let sut: CreateGymUsecase

  beforeAll(() => {
    gymsRepo = new PrismaGymsRepository()
  })

  beforeEach(async () => {
    sut = new CreateGymUsecase(gymsRepo)
    await cleanDb()
  })

  it('should be able to create gym successfully', async () => {
    const mockGym: CreateGymUsecaseInput = {
      name: 'Gym Name',
      latitude: 0,
      longitude: 0,
      description: null,
      phone: null,
    }
    const { gym } = await sut.handle(mockGym)
    expect(gym).toMatchObject({
      id: expect.any(String),
      ...mockGym,
    })
  })
})
