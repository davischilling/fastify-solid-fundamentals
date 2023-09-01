import { prisma } from '@/lib/prisma'
import { Prisma, CheckIn } from '@prisma/client'
import { CheckInRepositoryInterface } from '../check-in-repository.interface'

export class PrismaCheckInsRepository implements CheckInRepositoryInterface {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    return await prisma.checkIn.create({
      data,
    })
  }

  async findById(checkInId: string): Promise<CheckIn | null> {
    return await prisma.checkIn.findUnique({
      where: {
        id: checkInId,
      },
    })
  }
}
