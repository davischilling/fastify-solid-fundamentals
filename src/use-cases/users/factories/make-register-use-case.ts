import { PrismaUsersRepository } from '@/repositories/prisma/users'
import { UserRegisterUsecase } from '@/use-cases/users'

export function makeRegisterUseCase() {
  const userRepo = new PrismaUsersRepository()
  const userRegisterUsecase = new UserRegisterUsecase(userRepo)
  return userRegisterUsecase
}
