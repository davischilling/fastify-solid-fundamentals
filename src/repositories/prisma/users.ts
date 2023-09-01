import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UserRepositoryInterface } from '../user-repository.interface'

export class PrismaUsersRepository implements UserRepositoryInterface {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async findById(userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
  }
}
