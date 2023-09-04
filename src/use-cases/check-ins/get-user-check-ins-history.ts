import { ResourceNotFoundError } from '@/errors'
import {
  CheckInRepositoryInterface,
  UserRepositoryInterface,
} from '@/repositories'
import { CheckIn } from '@prisma/client'

export interface GetUserCheckInsHistoryUsecaseInput {
  userId: string
  page?: number
}

type GetUserCheckInsHistoryOutput = {
  checkIns: CheckIn[]
}

export class GetUserCheckInsHistoryUsecase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly checkInRepository: CheckInRepositoryInterface,
  ) {}

  async handle({
    userId,
    page,
  }: GetUserCheckInsHistoryUsecaseInput): Promise<GetUserCheckInsHistoryOutput> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }
    const checkIns = await this.checkInRepository.findManyByUserId(
      userId,
      page ?? 1,
    )
    return {
      checkIns,
    }
  }
}
