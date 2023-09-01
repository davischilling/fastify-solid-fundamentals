import { Prisma, User } from '@prisma/client'

export interface UserRepositoryInterface {
  create(data: Prisma.UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(userId: string): Promise<User | null>
}
