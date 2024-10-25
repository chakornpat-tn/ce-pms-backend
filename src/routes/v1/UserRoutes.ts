import { Elysia, t } from 'elysia'
import useUserController from '@/controllers/v1/UserController'

const userRoutes = new Elysia({ prefix: '/user' })
const userController = useUserController()

userRoutes
  .get('/', userController.ListUsers)
  .get('/:id', userController.FindUserByID)
  .put('/:id', userController.UpdateUser,{
    body: t.Object({
      name: t.Optional(t.String()),
      password: t.Optional(t.String()),
      role: t.Optional(t.Number()),
    }),
  })
  .delete('/:id', userController.DeleteUserByID)
  .post('/', userController.CreateUser, {
    body: t.Object({
      name: t.String(),
      username: t.String(),
      password: t.String(),
      role: t.Optional(t.Number()),
    }),
  })

export default userRoutes
