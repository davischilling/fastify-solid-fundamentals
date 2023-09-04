import { prisma } from '@/lib/prisma'

export const cleanDb = async () => {
  const deleteCheckIns = prisma.checkIn.deleteMany()
  const deleteGyms = prisma.gym.deleteMany()
  const deleteUsers = prisma.user.deleteMany()
  await prisma.$transaction([deleteCheckIns, deleteGyms, deleteUsers])
}
