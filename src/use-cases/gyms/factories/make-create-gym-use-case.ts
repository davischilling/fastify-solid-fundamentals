import { PrismaGymsRepository } from '@/repositories'
import { CreateGymUsecase } from '@/use-cases/gyms'

export const makeCreateGymUseCase = () => {
  return new CreateGymUsecase(new PrismaGymsRepository())
}
