import { Prisma, Gym } from '@prisma/client'

export interface GymRepositoryInterface {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(gymId: string): Promise<Gym | null>
  findManyByFilters(
    page: number,
    orderBy: {
      name: 'asc' | 'desc'
    },
    filters?: { name: string },
  ): Promise<Gym[] | null>
  findManyNearBy(userLocation: {
    userLatitude: number
    userLongitude: number
  }): Promise<Gym[] | null>
}
