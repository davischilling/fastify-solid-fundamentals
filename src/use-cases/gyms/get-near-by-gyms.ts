import { GymRepositoryInterface } from '@/repositories'
import { gymMapper } from '@/utils'

export interface GetNearByGymsUsecaseInput {
  userLatitude: number
  userLongitude: number
}

type Gym = {
  id: string
  latitude: number
  longitude: number
  name: string
  description: string | null
  phone: string | null
}

type GetNearByGymsOutput = {
  gyms: Gym[]
}

export class GetNearByGymsUsecase {
  constructor(private readonly gymRepository: GymRepositoryInterface) {}

  async handle({
    userLatitude,
    userLongitude,
  }: GetNearByGymsUsecaseInput): Promise<GetNearByGymsOutput> {
    const gyms = await this.gymRepository.findManyNearBy({
      userLatitude,
      userLongitude,
    })

    return {
      gyms: gyms ? gyms.map((gym) => gymMapper(gym)) : [],
    }
  }
}
