import { GymRepositoryInterface } from '@/repositories'
import { gymMapper } from '@/utils'

export interface GetGymsByFiltersUsecaseInput {
  filters?: {
    name: string
  }
  page?: number
  orderBy?: {
    name: 'asc' | 'desc'
  }
}

type Gym = {
  id: string
  latitude: number
  longitude: number
  name: string
  description: string | null
  phone: string | null
}

type GetGymsByFiltersOutput = {
  gyms: Gym[]
}

export class GetGymsByFiltersUsecase {
  constructor(private readonly gymRepository: GymRepositoryInterface) {}

  async handle({
    page,
    orderBy,
    filters,
  }: GetGymsByFiltersUsecaseInput): Promise<GetGymsByFiltersOutput> {
    const gyms = await this.gymRepository.findManyByFilters(
      page ?? 1,
      orderBy ?? { name: 'asc' },
      filters,
    )

    return {
      gyms: gyms ? gyms.map((gym) => gymMapper(gym)) : [],
    }
  }
}
