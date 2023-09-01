import { Prisma, CheckIn } from '@prisma/client'

export interface CheckInRepositoryInterface {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findById(checkInId: string): Promise<CheckIn | null>
}
