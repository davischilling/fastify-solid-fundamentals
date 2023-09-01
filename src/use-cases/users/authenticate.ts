import { InvalidCredentialsError } from '@/errors/invalid-credentials'
import { UserRepositoryInterface } from '@/repositories/user-repository.interface'
import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

interface UserAuthenticateUsecaseInput {
  email: string
  password: string
}

type UserAuthenticateUsecaseOutput = {
  user: User
}

export class UserAuthenticateUsecase {
  constructor(private readonly usersRepository: UserRepositoryInterface) {}

  async handle({
    email,
    password,
  }: UserAuthenticateUsecaseInput): Promise<UserAuthenticateUsecaseOutput> {
    const user = await this.usersRepository.findByEmail(email)
    if (!user) {
      throw new InvalidCredentialsError()
    }
    const passwordMatch = await compare(password, user.password_hash)
    if (!passwordMatch) {
      throw new InvalidCredentialsError()
    }
    return {
      user,
    }
  }
}
