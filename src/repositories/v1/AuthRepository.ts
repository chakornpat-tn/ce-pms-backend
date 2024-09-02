import User from '../../models/User'
import Project from '../../models/Project'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export interface IUser {
  _id: string
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

export const FindUserByUsername = async (
  username: string
): Promise<IUser | null> => {
  return (await User.findOne({ username: username }).lean()) as IUser | null
}

export const FindProjectByUsername = async (username: string) => {
  return (await Project.findOne({
    username: username,
  }).lean()) as IProjectRes | null
}

// function find user by username use prisma
export const FindUserByUsernameWithPrisma = async (username: string) => {
  const user = await prisma.users.findUnique({
    where: {
      username: username,
    },
  })

  if (!user) return null

  return user
}