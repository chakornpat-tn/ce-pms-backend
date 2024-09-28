import Project from '../../models/Project'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export interface IUser {
  id: string
  name: string
  password: string
  role: number
}

export interface IProjectRes {
  _id: string
  username: string
  password: string
  title: string
}

const FindProjectByUsername = async (username: string) => {
  return (await Project.findOne({
    username: username,
  }).lean()) as IProjectRes | null
}
export const useAuthRepository = () => {
  const FindUserByUsername = async (username: string) => {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (!user) return null

    return user
  }
  
  return {
    FindUserByUsername,
  }
}

export default useAuthRepository
