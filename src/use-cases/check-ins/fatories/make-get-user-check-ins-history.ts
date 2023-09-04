import { PrismaCheckInsRepository, PrismaUsersRepository } from '@/repositories'
import { GetUserCheckInsHistoryUsecase } from '@/use-cases/check-ins'

export const makeGetUserCheckInsHistoryUsecase = () => {
  return new GetUserCheckInsHistoryUsecase(
    new PrismaUsersRepository(),
    new PrismaCheckInsRepository(),
  )
}
