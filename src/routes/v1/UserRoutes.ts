import { Elysia } from 'elysia'
import useUserController from '@/controllers/v1/UserController'

const userAPP = new Elysia()
const userController = useUserController(userAPP)

userAPP.group('/user', app => app
  .use(userController.ListUsers)
  .use(userController.FindUserByID)
  .use(userController.UpdateUser)
  .use(userController.DeleteUserByID)
  .use(userController.CreateUser)
)

export default userAPP