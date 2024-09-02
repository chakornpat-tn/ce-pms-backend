import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const userSelect = {
  id: true,
  name: true,
  username: true,
  role: true,
  createdAt: true,
  projectsId: false,
}

const CountUsers = async (search?: string, roleFilter?: number) => {
  const totalCount = await prisma.users.count({
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

    const users = await prisma.users.findMany({
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
  const FindUserByID = async (id: string) => {
    const user = await prisma.users.findUnique({
      where: {
        id: id,
      },
      select: userSelect,
    })
    return user
  }

  const DeleteUserByID = async (id: string) => {
    const user = await prisma.users.delete({
      where: {
        id: id,
      },
    })
    return user
  }

  const UpdateUserByID = async (id: string, userData: any) => {
    const updatedUser = await prisma.users.update({
      where: {
        id: id,
      },
      data: userData,
    })

    return updatedUser
  }

  const CreateUser = async (userData: any) => {
    const user = await prisma.users.create({
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
