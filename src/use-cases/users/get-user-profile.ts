import { ResourceNotFoundError } from '@/errors'
import { UserRepositoryInterface } from '@/repositories/user-repository.interface'
import { User } from '@prisma/client'

interface GetUserProfileUsecaseInput {
  userId: string
}

type GetUserProfileUsecaseOutput = {
  user: User
}

export class GetUserProfileUsecase {
  constructor(private readonly usersRepository: UserRepositoryInterface) {}

  async handle({
    userId,
  }: GetUserProfileUsecaseInput): Promise<GetUserProfileUsecaseOutput> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }
    return {
      user,
    }
  }
}
