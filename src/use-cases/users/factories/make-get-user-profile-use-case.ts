import { PrismaUsersRepository } from '@/repositories/prisma/users'
import { GetUserProfileUsecase } from '@/use-cases/users'

export function makeGetUserProfileUseCase() {
  const userRepo = new PrismaUsersRepository()
  const getUserProfileUsecase = new GetUserProfileUsecase(userRepo)
  return getUserProfileUsecase
}
