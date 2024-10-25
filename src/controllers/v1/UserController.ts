import { Context } from 'elysia'
import * as utils from '@/utils'
import useUserRepository from '@/repositories/v1/UserRepository'
import {User} from '@/models/User'
import userRoles from '@/statics/constants/userRoles/userRoles'


const saltRounds = Number(process.env.SALT_ROUNDS)
const userRepo = useUserRepository()

const title = 'User Controller V1'

const useUserController = () => {
  const ListUsers = async ({ query, set }: Context) => {
    try {
      const page: number = Math.max(parseInt(query.page as string) || 1, 1)
      const perPage: number = Math.max(parseInt(query.perPage as string) || 30, 1)
      const role: number | undefined = query.role ? parseInt(query.role as string) : undefined
      const search: string | undefined = query.search as string

      const { totalCount, users } = await userRepo.GetUsers(page, perPage, search, role)

      return utils.SuccessMessage(title, 'List users successfully', {
        totalCount,
        users,
      })
    } catch (error) {
      utils.logger.warn(error as Error, 'UserController.ListUsers Error')
      set.status = 500
      return utils.ErrorMessage(title, 'Failed to list users')
    }
  }

  const FindUserByID = async ({ params, set }: Context) => {
    try {
      const id = parseInt(params.id, 10)
      const user = await userRepo.FindUserByID(id)
      if (user) {
        return utils.SuccessMessage(title, 'Find user successfully', user)
      } else {
        set.status = 400
        return utils.NotFoundMessage()
      }
    } catch (error) {
      utils.logger.warn(error as Error, 'UserController.FindUserByID Error')
      set.status = 500
      return utils.ErrorMessage(title, 'Find user error')
    }
  }

  const DeleteUserByID = async ({ params, set }: Context) => {
    try {
      const id = parseInt(params.id, 10)
      await userRepo.DeleteUserByID(id)
      set.status = 200
      return utils.SuccessMessage(title, 'Deleted user successfully')
    } catch (error) {
      utils.logger.warn(error as Error, 'UserController.DeleteUserByID Error')
      set.status = 500
      return utils.ErrorMessage(title, 'Failed to delete user')
    }
  }

  const UpdateUser = async ({ params, body, set }: Context) => {
    try {
      const id = parseInt(params.id, 10)
      const req = body as User

      if (req.username) throw new Error(`Cannot change username`)
      if (req.password) {
        req.password = await Bun.password.hash(req.password, {
          algorithm: 'bcrypt',
          cost: saltRounds,
        })
      }

      await userRepo.UpdateUserByID(id, req)

      return utils.SuccessMessage(title, 'Update user successfully')
    } catch (error) {
      utils.logger.warn(error as Error, 'UserController.UpdateUser Error')
      set.status = 500
      return utils.ErrorMessage(title, 'Failed to update user')
    }
  }

  const CreateUser = async ({ body, set }: Context) => {
    try {
      const req = body as User

      if (!req.role) req.role = userRoles.Teacher

      const passwordHash = await Bun.password.hash(req.password,{
        algorithm: 'bcrypt',
        cost: saltRounds,
      })
      req.password = passwordHash
      await userRepo.CreateUser(req)

      return utils.SuccessMessage(title, 'Create user successfully')
    } catch (error) {
      utils.logger.warn(error as Error, 'UserController.CreateUser Error')
      set.status = 500
      return utils.ErrorMessage(title, 'Failed to create user')
    }
  }

  return {
    ListUsers,
    FindUserByID,
    DeleteUserByID,
    UpdateUser,
    CreateUser,
  }
}

export default useUserController
