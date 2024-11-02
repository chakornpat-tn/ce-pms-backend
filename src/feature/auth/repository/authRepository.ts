import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const userSelect = {
  id: true,
  name: true,
  username: true,
  role: true,
  createdAt: true,
  updatedAt: true,
}

export class AuthRepository {
  static FindUserByUsername = async (username: string) => {
    return await prisma.user.findUnique({
      where: {
        username,
        deletedAt: null,
      },
    })
  }

  static FindProjectByUsername = async (username: string) => {
    return await prisma.project.findUnique({
      where: {
        username,
      },
    })
  }
}
