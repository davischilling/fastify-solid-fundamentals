import { UserAlreadyExistsError } from '@/errors'
import { UserRepositoryInterface } from '@/repositories/user-repository.interface'
import { hash } from 'bcryptjs'

interface UserRegisterUsecaseInputs {
  name: string
  email: string
  password: string
}

export class UserRegisterUsecase {
  constructor(private readonly usersRepository: UserRepositoryInterface) {}

  async handle({ name, email, password }: UserRegisterUsecaseInputs) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
