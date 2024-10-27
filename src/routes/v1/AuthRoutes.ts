import { Elysia, t } from 'elysia'
import useAuthController from '@/controllers/v1/AuthController'

const authApp = new Elysia()
const authController = useAuthController(authApp)

authApp.group('/auth', app => app
  .use(authController.User)
  .use(authController.Project)
)

export default authApp