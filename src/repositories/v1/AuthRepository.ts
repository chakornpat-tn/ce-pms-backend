import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const useAuthRepository = () => {
  const FindUserByUsername = async (username: string) => {
    const user = await prisma.user.findUnique({
      where: {
        username,
        deletedAt: null,
      },
    })

    if (!user) return null

    return user
  }

  const FindProjectByUsername = async (username: string) => {
    const project = await prisma.project.findUnique({
      where: {
        username,
      },
    })
    
    if (!project) return null

    return project
  }
  
  return {
    FindUserByUsername,
    FindProjectByUsername
  }
}

export default useAuthRepository
