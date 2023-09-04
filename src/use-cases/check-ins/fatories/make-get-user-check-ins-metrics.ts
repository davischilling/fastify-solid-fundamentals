import { PrismaCheckInsRepository, PrismaUsersRepository } from '@/repositories'
import { GetUserCheckInsMetricsUsecase } from '@/use-cases/check-ins'

export const makeGetUserCheckInsMetricsUsecase = () => {
  return new GetUserCheckInsMetricsUsecase(
    new PrismaUsersRepository(),
    new PrismaCheckInsRepository(),
  )
}
