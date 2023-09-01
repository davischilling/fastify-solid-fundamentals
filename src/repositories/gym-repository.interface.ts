import { Prisma, Gym } from '@prisma/client'

export interface GymRepositoryInterface {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(gymId: string): Promise<Gym | null>
}
