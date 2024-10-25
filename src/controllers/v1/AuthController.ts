import { Context } from 'elysia'
import useAuthRepository from '@/repositories/v1/AuthRepository'
import * as utils from '@/utils'
import userRoles from '@/statics/constants/userRoles/userRoles'

const authRepo = useAuthRepository()
const title = 'Auth Controller V1'

const useAuthController = () => {
  const User = async ({ body, set, jwt }: Context & { jwt: any }) => {
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

      const { password: _, ...payload } = result

      const token = await jwt.sign(payload)

      return utils.SuccessMessage(title, 'login successfully', { token })
    } catch (error) {
      utils.logger.warn(error, 'useAuthController.User error :')
      set.status = 401
      return utils.UnauthorizedMessage(title)
    }
  }
  const Project = async ({ body, set, jwt }: Context & { jwt: any }) => {
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
          name: project.projectName,
          role: userRoles.Student,
          firstLogin: true,
        }

        token = await jwt.sign(payload)
      } else if (project && project.password) {
        if (!password) throw new Error(`Password is required`)

        const isMatch = await Bun.password.verify(password, project.password)
        if (!isMatch) throw new Error('passwords do not match')

        const payload = {
          id: project.id,
          name: project.projectName,
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
  }

  return {
    User,
    Project,
  }
}

export default useAuthController
