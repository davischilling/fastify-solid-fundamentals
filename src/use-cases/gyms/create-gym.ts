import { GymRepositoryInterface } from '@/repositories'
import { gymMapper } from '@/utils'

export interface CreateGymUsecaseInput {
  latitude: number
  longitude: number
  name: string
  description: string | null
  phone: string | null
}

type CreateGymOutput = {
  gym: {
    id: string
    latitude: number
    longitude: number
    name: string
    description: string | null
    phone: string | null
  }
}

export class CreateGymUsecase {
  constructor(private readonly gymRepository: GymRepositoryInterface) {}

  async handle(data: CreateGymUsecaseInput): Promise<CreateGymOutput> {
    const gym = await this.gymRepository.create(data)
    return {
      gym: gymMapper(gym),
    }
  }
}
