import { prisma } from '@/lib/prisma'
import { Prisma, CheckIn } from '@prisma/client'
import { CheckInRepositoryInterface } from '../check-in-repository.interface'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInRepositoryInterface {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    return await prisma.checkIn.create({
      data,
    })
  }

  async updateById({
    checkInId,
    data,
  }: {
    checkInId: string
    data: Prisma.CheckInUncheckedUpdateInput
  }): Promise<CheckIn> {
    return await prisma.checkIn.update({
      where: {
        id: checkInId,
      },
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

  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')
    return prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lt: endOfTheDay.toDate(),
        },
      },
    })
  }

  findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const perPage = 20 // Number of records to return per page
    const skip = (page - 1) * perPage // Calculate the number of records to skip
    return prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: perPage, // Limit the number of records to per page
      skip, // Skip the appropriate number of records based on the page
    })
  }

  countByUserId(userId: string): Promise<number> {
    return prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
  }
}
