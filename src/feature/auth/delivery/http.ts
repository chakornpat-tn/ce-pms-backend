import Elysia, { t } from 'elysia'
import bearer from '@elysiajs/bearer'
import * as middleWare from '@/middleware'
import * as utils from '@/utils'
import { AuthUsecase } from '../usercase/authUsecase'

const title = 'Auth Controller V1'
const authUsecase = AuthUsecase

const AuthSwaggerDetail = (summary: string, detail: string) => {
  return {
    tags: ['Auth'],
    summary: summary,
    detail: detail,
  }
}

export const AuthDelivery = new Elysia({ prefix: '/auth' })
  .use(bearer())
  .use(middleWare.JwtConfig)
  .post(
    '/login',
    async ({ body, set, jwt }) => {
      try {
        const { username, password } = body as {
          username: string
          password: string
        }
        const payload = await authUsecase.UserLogin(username, password)
        const token = await jwt.sign(payload)
        return utils.SuccessMessage(title, 'login successfully', { token })
      } catch (error) {
        utils.logger.warn(error, title + ' error :')
        set.status = 401
        return utils.UnauthorizedMessage(title)
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
      detail: AuthSwaggerDetail(
        'User Login',
        'Login user with username and password'
      ),
    }
  )
  .post(
    '/login/project',
    async ({ body, set, jwt }) => {
      try {
        const { username, password } = body as {
          username: string
          password?: string
        }
        const payload = await authUsecase.ProjectLogin(username, password)
        if (!payload) throw new Error('Invalid username or password')

        const token = await jwt.sign(payload)
        
        return utils.SuccessMessage(title, 'project login successfully', {
          token,
        })
      } catch (error) {
        utils.logger.warn(error, title + ' error :')
        set.status = 401
        return utils.UnauthorizedMessage(title)
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.Optional(t.String()),
      }),
      detail: AuthSwaggerDetail(
        'Project Login',
        'Login user with username, password and project'
      ),
    }
  )