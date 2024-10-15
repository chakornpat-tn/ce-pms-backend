import { Request, Response } from 'express'
import { encrypt } from '../../utils/jwt/jwt'
import bcrypt from 'bcrypt'
import useAuthRepository from '@/repositories/v1/AuthRepository'
import * as utils from '@/utils'
import userRoles from '@/statics/constants/userRoles/userRoles'

const authRepo = useAuthRepository()

const title = 'Auth Controller V1'

const useAuthController = () => {
  const User = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body as {
        username: string
        password: string
      }
      let result = await authRepo.FindUserByUsername(username)

      if (result) {
        if (!bcrypt.compareSync(password, result.password)) {
          throw new Error('passwords do not match')
        }
      } else {
        throw new Error(`Could not find:${username}`)
      }

      const secretKey = process.env.TOKEN_SECRET
      if (!secretKey) {
        res.status(500).json(utils.ErrorMessage(title, 'secret key not found'))
      }

      const { password: _, ...payload } = result

      const token = await encrypt(payload)

      res
        .status(200)
        .json(utils.SuccessMessage(title, 'login successfully', { token }))
    } catch (error) {
      utils.logger.warn(error, 'useAuthController.User error :')
      res.status(401).json(utils.UnauthorizedMessage(title))
    }
  }

  const Project = async (req: Request, res: Response) => {
    try {
      let token
      const { username, password } = req.body as {
        username: string
        password?: string
      }
      const project = await authRepo.FindProjectByUsername(username)

      if (!project) throw new Error(`Could not find project`)

      if (project && !project.password) {
        const secretKey = process.env.TOKEN_SECRET
        if (!secretKey)
          res
            .status(500)
            .json(utils.ErrorMessage(title, 'secret key not found'))

        const payload = {
          id: project.id,
          name: project.projectName,
          role: userRoles.Student,
          firstLogin: true,
        }

        token = await encrypt(payload)
      } else if (project && project.password) {
        if (password == undefined || !password)
          throw new Error(`Password is required`)

        if (!bcrypt.compareSync(password, project.password))
          throw new Error('passwords do not match')

        const payload = {
          id: project.id,
          name: project.projectName,
          role: userRoles.Student,
        }
        token = await encrypt(payload)
      }

      res
        .status(200)
        .json(utils.SuccessMessage(title, 'login successfully', { token }))
    } catch (error) {
      utils.logger.warn(error, 'useAuthController.Project error :')
      res
        .status(401)
        .json(utils.UnauthorizedMessage(title, (error as Error).message))
    }
  }

  return {
    User,
    Project,
  }
}

export default useAuthController