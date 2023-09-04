import { PrismaUsersRepository } from '@/repositories/prisma/users'
import { UserAuthenticateUsecase } from '@/use-cases/users'

export function makeAuthenticateUseCase() {
  const userRepo = new PrismaUsersRepository()
  const userAuthenticateUsecase = new UserAuthenticateUsecase(userRepo)
  return userAuthenticateUsecase
}
