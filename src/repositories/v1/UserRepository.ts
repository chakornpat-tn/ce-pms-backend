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

const CountUsers = async (search?: string, roleFilter?: number) => {
  const totalCount = await prisma.user.count({
    where: {
      AND: [
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

export const useUserRepository = () => {
  const GetUsers = async (
    page: number,
    perPage: number,
    search?: string,
    roleFilter?: number
  ) => {
    const totalCount = await CountUsers(search, roleFilter)

    const users = await prisma.user.findMany({
      where: {
        AND: [
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
  const FindUserByID = async (id: number) => {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: userSelect,
    })
    return user
  }

  const DeleteUserByID = async (id: number) => {
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    })
    return user
  }

  const UpdateUserByID = async (id: number, userData: any) => {
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: userData,
    })

    return updatedUser
  }

  const CreateUser = async (userData: any) => {
    const user = await prisma.user.create({
      data: {
        ...userData,
      },
    })
    return user
  }

  return {
    GetUsers,
    FindUserByID,
    DeleteUserByID,
    UpdateUserByID,
    CreateUser,
  }
}

export default useUserRepository
