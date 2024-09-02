import { Request, Response } from 'express'
import useUserRepository from '../repositories/v1/UserRepository'
import userRoles from '../statics/constants/userRoles/userRoles'
import { Error } from 'mongoose'
import bcrypt from 'bcrypt'

const saltRounds = Number(process.env.SALT_ROUNDS)
const userRepo = useUserRepository()

export const ListUsers = async (req: Request, res: Response) => {
  try {
    const page: number = Math.max(parseInt(req.query.page as string) || 1, 1)
    const perPage: number = Math.max(
      parseInt(req.query.perPage as string) || 30,
      1
    )
    const role: number | undefined = req.query.role
      ? parseInt(req.query.role as string)
      : undefined
    const search: string | undefined = req.query.search as string

    const { totalCount, users } = await userRepo.GetUsers(
      page,
      perPage,
      search,
      role
    )

    res.json({ totalCount, users })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const FindUserByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await userRepo.FindUserByID(id)
    if (user) {
      res.json(user)
    } else {
      res.status(404)
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const DeleteUserByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await userRepo.DeleteUserByID(id)
    if (user) {
      res.status(200)
    } else {
      res.status(404)
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = req.body

    if (user.username) throw new Error(`cannot change username`)
    if (user.password) {
      user.password = await bcrypt.hashSync(user.password, saltRounds)
    }

    const result = await userRepo.UpdateUserByID(id, user)

    res.json({ message: 'Updated user: ' + result?.name })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const CreateUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body

    if (!userData.password) {
      throw new Error('Password is required')
    }

    if (!userData.role) userData.role = userRoles.Teacher

    const passwordHash = await bcrypt.hash(userData.password, saltRounds)
    userData.password = passwordHash
    const user = await userRepo.CreateUser(userData)

    res
      .status(200)
      .json({ message: 'Created successfully user: ' + user?.name })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}
