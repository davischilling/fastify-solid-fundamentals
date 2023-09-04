import {
  PrismaCheckInsRepository,
  PrismaGymsRepository,
  PrismaUsersRepository,
} from '@/repositories'
import { CreateCheckInUseCase } from '@/use-cases/check-ins'

export const makeCreateCheckInUseCase = () => {
  return new CreateCheckInUseCase(
    new PrismaCheckInsRepository(),
    new PrismaGymsRepository(),
    new PrismaUsersRepository(),
  )
}
