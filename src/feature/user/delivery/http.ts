import Elysia, { t } from 'elysia'
import { UserUsecase } from '../usercase/userUsecase'
import bearer from '@elysiajs/bearer'
import { User } from '@prisma/client'
import * as middleWare from '@/middleware'
import * as utils from '@/utils'

const title = 'User Controller V1'
const userUsecase = UserUsecase
const userSwaggerDetail = (summary: string, detail: string) => {
  return {
    tags: ['User'],
    summary: summary,
    detail: detail,
  }
}

export const UserDelivery = new Elysia({ prefix: '/user' })
  .use(bearer())
  .use(middleWare.JwtConfig)
  .guard({
    beforeHandle: middleWare.checkAuthorization,
  })
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const page = query.page || 1
        const perPage = query.perPage || 30
        const role = query.role || undefined
        const search: string | undefined = query.search as string

        const { totalCount, users } = await userUsecase.ListUser(
          page,
          perPage,
          search,
          role
        )

        return utils.SuccessMessage(title, 'List users successfully', {
          totalCount,
          users,
        })
      } catch (error) {
        utils.logger.warn(error as Error, 'UserController.ListUsers Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Failed to list users')
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        perPage: t.Optional(t.Number()),
        role: t.Optional(t.Number()),
        search: t.Optional(t.String()),
      }),
      detail: userSwaggerDetail('List Users', 'Get a list of users'),
    }
  )
  .get(
    '/:id',
    async ({ params, set }) => {
      try {
        const id = params.id
        const user = await userUsecase.FindUserByID(id)
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
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: userSwaggerDetail('Find User By ID', 'Get a user by ID'),
      
    }
  )
  .delete(
    '/:id',
    async ({ params, set }) => {
      try {
        const id = params.id
        const user = await userUsecase.DeleteUserByID(id)
        if (user) {
          return utils.SuccessMessage(title, 'Delete user successfully', user)
        } else {
          set.status = 400
          return utils.NotFoundMessage()
        }
      } catch (error) {
        utils.logger.warn(error as Error, 'UserController.DeleteUserByID Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Delete user error')
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: userSwaggerDetail('Delete User By ID', 'Delete a user by ID'),
      
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      try {
        const id = params.id
        const req = body as User
        const user = await userUsecase.UpdateUserByID(id, req)
        if (user) {
          return utils.SuccessMessage(title, 'Update user successfully', user)
        } else {
          set.status = 400
          return utils.NotFoundMessage()
        }
      } catch (error) {
        utils.logger.warn(error as Error, 'UserController.UpdateUser Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Update user error')
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        name: t.Optional(t.String()),
        password: t.Optional(t.String()),
        role: t.Optional(t.Number()),
      }),
      detail: userSwaggerDetail('Update User', 'Update a user'),
      
    }
  )
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const req = body as User
        const user = await userUsecase.CreateUser(req)
        if (user) {
          return utils.SuccessMessage(title, 'Create user successfully', user)
        } else {
          set.status = 400
          return utils.ErrorMessage(title, 'Create user error')
        }
      } catch (error) {
        utils.logger.warn(error as Error, 'UserController.CreateUser Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Create user error')
      }
    },
    {
      body: t.Object({
        name: t.String(),
        username: t.String(),
        password: t.String(),
        role: t.Optional(t.Number()),
      }),
      detail: userSwaggerDetail('Create User', 'Create a new user'),
      
    }
  )
