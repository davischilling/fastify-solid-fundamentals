import { Prisma, CheckIn } from '@prisma/client'

export interface CheckInRepositoryInterface {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  updateById(params: {
    checkInId: string
    data: Prisma.CheckInUpdateInput
  }): Promise<CheckIn>
  findById(checkInId: string): Promise<CheckIn | null>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
}
