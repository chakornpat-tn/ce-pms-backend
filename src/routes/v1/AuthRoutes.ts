import { Elysia, t } from 'elysia'
import useAuthController from '@/controllers/v1/AuthController'

const authRoutes = new Elysia({ prefix: '/auth' })
const authController = useAuthController()

authRoutes
  .post('/login', authController.User, {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    }),
  })
  .post('/login/project', authController.Project, {
    body: t.Object({
      username: t.String(),
      password: t.Optional(t.String()),
    }),
  })

export default authRoutes
