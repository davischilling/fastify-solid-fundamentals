import { queryFilter } from '@/utils'
import { prisma } from '@/lib/prisma'
import { Prisma, Gym } from '@prisma/client'
import { GymRepositoryInterface } from '../gym-repository.interface'

export class PrismaGymsRepository implements GymRepositoryInterface {
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    return await prisma.gym.create({
      data,
    })
  }

  async findById(gymId: string): Promise<Gym | null> {
    return await prisma.gym.findUnique({
      where: {
        id: gymId,
      },
    })
  }

  async findManyByFilters(
    page: number,
    orderBy: {
      name: 'asc' | 'desc'
    },
    filters?: { name: string },
  ): Promise<Gym[] | null> {
    const perPage = 20 // Number of records to return per page
    const skip = (page - 1) * perPage // Calculate the number of records to skip
    const where = queryFilter(filters)
    return await prisma.gym.findMany({
      where,
      orderBy,
      take: perPage, // Limit the number of records to per page
      skip, // Skip the appropriate number of records based on the page
    })
  }

  async findManyNearBy({
    userLatitude,
    userLongitude,
  }: {
    userLatitude: number
    userLongitude: number
  }): Promise<Gym[] | null> {
    return await prisma.gym.findMany({
      where: {
        AND: [
          // Filter gyms within 10 kilometers (10,000 meters) radius of user's location
          {
            latitude: {
              gte: userLatitude - 0.0909, // Approximate latitude difference for 10km
              lte: userLatitude + 0.0909,
            },
            longitude: {
              gte: userLongitude - 0.0909, // Approximate longitude difference for 10km
              lte: userLongitude + 0.0909,
            },
          },
        ],
      },
    })
  }
}
