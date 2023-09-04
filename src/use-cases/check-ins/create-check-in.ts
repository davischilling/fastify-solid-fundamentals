import {
  MaxDistanceError,
  MaxNumberOfCheckInsError,
  ResourceNotFoundError,
} from '@/errors'
import {
  CheckInRepositoryInterface,
  GymRepositoryInterface,
  UserRepositoryInterface,
} from '@/repositories'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { CheckIn } from '@prisma/client'

interface CreateCheckInInput {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
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
    userLatitude,
    userLongitude,
  }: CreateCheckInInput): Promise<CreateCheckInOutput> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }
    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )
    const MAX_DISTANCE_IN_KM = 0.1 // 100 meters
    if (distance > MAX_DISTANCE_IN_KM) {
      throw new MaxDistanceError()
    }
    const checkInOnDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )
    if (checkInOnDate) {
      throw new MaxNumberOfCheckInsError()
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
