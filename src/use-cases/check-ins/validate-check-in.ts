import { MaxTimeError, ResourceNotFoundError } from '@/errors'
import { CheckInRepositoryInterface } from '@/repositories'
import { CheckIn } from '@prisma/client'

interface ValidateCheckInInput {
  checkInId: string
}

type ValidateCheckInOutput = {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(
    private readonly checkInsRepository: CheckInRepositoryInterface,
  ) {}

  async handle({
    checkInId,
  }: ValidateCheckInInput): Promise<ValidateCheckInOutput> {
    const checkIn = await this.checkInsRepository.findById(checkInId)
    if (!checkIn) {
      throw new ResourceNotFoundError()
    }
    // compare 20 minutes difference between checkIn.created_at and now
    // if difference is greater than 20 minutes, throw error
    // if difference is less than 20 minutes, update checkIn.validated_at
    const now = new Date()
    const differenceInMinutes = Math.abs(
      (now.getTime() - checkIn.created_at.getTime()) / 1000 / 60,
    )
    const MAX_TIME_IN_MINUTES = 20 // 20 minutes
    if (differenceInMinutes > MAX_TIME_IN_MINUTES) {
      throw new MaxTimeError()
    }

    const updatedCheckIn = await this.checkInsRepository.updateById({
      checkInId,
      data: {
        ...checkIn,
        validated_at: new Date(),
      },
    })
    return {
      checkIn: updatedCheckIn,
    }
  }
}
