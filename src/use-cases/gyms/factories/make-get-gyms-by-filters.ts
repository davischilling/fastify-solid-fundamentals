import { PrismaGymsRepository } from '@/repositories'
import { GetGymsByFiltersUsecase } from '@/use-cases/gyms'

export const makeGetGymsByFiltersUsecase = () => {
  return new GetGymsByFiltersUsecase(new PrismaGymsRepository())
}
