import { ResourceNotFoundError } from '@/errors'
import { InvalidCredentialsError } from '@/errors/invalid-credentials'
import {
  UserRepositoryInterface,
  CheckInRepositoryInterface,
  GymRepositoryInterface,
} from '@/repositories'
import { CheckIn } from '@prisma/client'
import { compare } from 'bcryptjs'

interface CreateCheckInInput {
  userId: string
  gymId: string
}

type CreateCheckInOutput = {
  checkIn: CheckIn
}

export class CreateCheckInUseCase {
  constructor(
    private readonly checkInsRepository: CheckInRepositoryInterface,
    private readonly gymsRepository: GymRepositoryInterface,
    private readonly usersRepository: UserRepositoryInterface,
  ) {}

  async handle({
    userId,
    gymId,
  }: CreateCheckInInput): Promise<CreateCheckInOutput> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })
    return {
      checkIn,
    }
  }
}
