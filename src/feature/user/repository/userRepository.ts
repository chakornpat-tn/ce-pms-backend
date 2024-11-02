import { PrismaClient } from '@prisma/client'
import { User } from '@prisma/client'

const prisma = new PrismaClient()

const userSelect = {
  id: true,
  name: true,
  username: true,
  role: true,
  createdAt: true,
  updatedAt: true,
}

export class UserRepository {
  private static CountUsers = async (search?: string, roleFilter?: number) =>  {
    const totalCount = await prisma.user.count({
      where: {
        AND: [
          {
            deletedAt: null,
          },
          {
            OR: [
              search
                ? {
                    name: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  }
                : {},
              search
                ? {
                    username: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  }
                : {},
            ],
          },
          roleFilter !== undefined
            ? {
                role: roleFilter,
              }
            : {},
        ],
      },
    })

    return totalCount
  }

  static GetUsers = async (
    page: number,
    perPage: number,
    search?: string,
    roleFilter?: number
  ): Promise<{ totalCount: number; users: any[] }> => {
    const totalCount = await this.CountUsers(search, roleFilter)

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            deletedAt: null,
          },
          {
            OR: [
              search
                ? {
                    name: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  }
                : {},
              search
                ? {
                    username: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  }
                : {},
            ],
          },
          roleFilter !== undefined
            ? {
                role: roleFilter,
              }
            : {},
        ],
      },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        role: 'desc',
      },
      select: userSelect,
    })

    return { totalCount, users }
  }

  static FindUserByID = async (id: number) => {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      select: userSelect,
    })
    return user
  }

  static DeleteUserByID = async (id: number) => {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
    return user
  }

  static UpdateUserByID = async (id: number, userData: User) => {
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: userData,
    })
    return updatedUser
  }

  static CreateUser = async (userData: User) => {
    const user = await prisma.user.create({
      data: {
        ...userData,
      },
    })
    return user
  }
}