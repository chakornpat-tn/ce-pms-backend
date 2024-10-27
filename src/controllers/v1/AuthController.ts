import { Elysia, t } from 'elysia'
import * as middleware from '@/middleware'
import * as utils from '@/utils'
import useAuthRepository from '@/repositories/v1/AuthRepository'
import userRoles from '@/statics/constants/userRoles/userRoles'

const authRepo = useAuthRepository()
const title = 'Auth Controller V1'
const useAuthController = (app: Elysia) => {
  const User = app.use(middleware.JwtConfig).post(
    '/login',
    async ({ body, set, jwt }) => {
      try {
        const { username, password } = body as {
          username: string
          password: string
        }
        let result = await authRepo.FindUserByUsername(username)

        if (result) {
          const isMatch = await Bun.password.verify(password, result.password)
          if (!isMatch) {
            throw new Error('passwords do not match')
          }
        } else {
          throw new Error(`Could not find:${username}`)
        }

        const { password: _, ...rest } = result
        const payload = {
          id: rest.id,
          name: rest.name || '',
          username: rest.username,
          role: rest.role,
        }

        const token = await jwt.sign(payload)

        return utils.SuccessMessage(title, 'login successfully', { token })
      } catch (error) {
        utils.logger.warn(error, 'useAuthController.User error :')
        set.status = 401
        return utils.UnauthorizedMessage(title)
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  )

  const Project = app.use(middleware.JwtConfig).post(
    '/login/project',
    async ({ body, set, jwt }) => {
      try {
        let token
        const { username, password } = body as {
          username: string
          password?: string
        }
        const project = await authRepo.FindProjectByUsername(username)

        if (!project) throw new Error(`Could not find project`)

        if (project && !project.password) {
          const secretKey = process.env.TOKEN_SECRET
          if (!secretKey) {
            set.status = 500
            return utils.ErrorMessage(title, 'secret key not found')
          }

          const payload = {
            id: project.id,
            name: project.projectName || '',
            role: userRoles.Student,
            firstLogin: 1,
          }

          token = await jwt.sign(payload)
        } else if (project && project.password) {
          if (!password) throw new Error(`Password is required`)

          const isMatch = await Bun.password.verify(password, project.password)
          if (!isMatch) throw new Error('passwords do not match')

          const payload = {
            id: project.id,
            name: project.projectName || '',
            role: userRoles.Student,
          }
          token = await jwt.sign(payload)
        }

        return utils.SuccessMessage(title, 'login successfully', { token })
      } catch (error) {
        utils.logger.warn(error, 'useAuthController.Project error :')
        set.status = 401
        return utils.UnauthorizedMessage(title, (error as Error).message)
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.Optional(t.String()),
      }),
    }
  )

  return {
    User,
    Project,
  }
}
export default useAuthController
