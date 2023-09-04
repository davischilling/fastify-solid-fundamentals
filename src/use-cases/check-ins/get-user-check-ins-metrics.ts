import { ResourceNotFoundError } from '@/errors'
import {
  CheckInRepositoryInterface,
  UserRepositoryInterface,
} from '@/repositories'

export interface GetUserCheckInsMetricsUsecaseInput {
  userId: string
}

type GetUserCheckInsMetricsOutput = {
  checkInsCount: number
}

export class GetUserCheckInsMetricsUsecase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly checkInRepository: CheckInRepositoryInterface,
  ) {}

  async handle({
    userId,
  }: GetUserCheckInsMetricsUsecaseInput): Promise<GetUserCheckInsMetricsOutput> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }
    const checkInsCount = await this.checkInRepository.countByUserId(userId)
    return {
      checkInsCount,
    }
  }
}
