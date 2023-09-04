import { PrismaCheckInsRepository } from '@/repositories'
import { ValidateCheckInUseCase } from '@/use-cases/check-ins'

export const makeValidateCheckInUseCase = () => {
  return new ValidateCheckInUseCase(new PrismaCheckInsRepository())
}
