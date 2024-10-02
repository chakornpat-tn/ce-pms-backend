import { Request, Response } from 'express'
import utils from '@/utils/Response/response'
import useUserRepository from '@/repositories/v1/UserRepository'
import userRoles from '@/statics/constants/userRoles/userRoles'
import bcrypt from 'bcrypt'

const saltRounds = Number(process.env.SALT_ROUNDS)
const userRepo = useUserRepository()

const title = 'User Controller V1'

const UserController = () => {
   const ListUsers = async (req: Request, res: Response) => {
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

      res.status(200).json(
        utils.SuccessMessage(title, 'list users successfully', {
          totalCount,
          users,
        })
      )
    } catch (error) {
      console.warn('Error:', (error as Error).message)
      res.status(500).json(utils.ErrorMessage(title, 'Failed to list users'))
    }
  }

   const FindUserByID = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10)
      const user = await userRepo.FindUserByID(id)
      if (user) {
        res
          .status(200)
          .json(utils.SuccessMessage(title, 'Update user successfully', user))
      } else {
        res.status(200).json(utils.NotFoundMessage)
      }
    } catch (error) {
      console.warn('Error:', (error as Error).message)
      res.status(500).json(utils.ErrorMessage(title, 'Find user error'))
    }
  }

   const DeleteUserByID = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10)
      const user = await userRepo.DeleteUserByID(id)
      if (user) {
        res.status(200)
      } else {
        res.status(404).json({ message: 'User not found' })
      }
    } catch (error) {
      console.warn('Error:', (error as Error).message)
      res.status(500).json(utils.ErrorMessage(title, 'Failed to delete user'))
    }
  }

   const UpdateUser = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10)
      const user = req.body

      if (user.username) throw new Error(`cannot change username`)
      if (user.password) {
        user.password = bcrypt.hashSync(user.password, saltRounds)
      }

      const result = await userRepo.UpdateUserByID(id, user)

      res
        .status(200)
        .json(utils.SuccessMessage(title, 'Update user successfully'))
    } catch (error) {
      console.warn('Error:', (error as Error).message)
      res.status(500).json(utils.ErrorMessage(title, 'Failed to update user'))
    }
  }
   const CreateUser = async (req: Request, res: Response) => {
    try {
      const userData = req.body

      if (!userData.password) {
        throw new Error('Password is required')
      }

      if (!userData.role) userData.role = userRoles.Teacher

      const passwordHash = await bcrypt.hash(userData.password, saltRounds)
      userData.password = passwordHash
      await userRepo.CreateUser(userData)

      res
        .status(200)
        .json(utils.SuccessMessage(title, 'Create user successfully'))
    } catch (error) {
      console.warn('Error:', (error as Error).message)
      res.status(500).json(utils.ErrorMessage(title, 'Failed to create user'))
    }
  }

  return {
    ListUsers,
    FindUserByID,
    DeleteUserByID,
    UpdateUser,
    CreateUser
  }
}

export default UserController