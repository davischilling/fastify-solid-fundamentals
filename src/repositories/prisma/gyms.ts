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
}
