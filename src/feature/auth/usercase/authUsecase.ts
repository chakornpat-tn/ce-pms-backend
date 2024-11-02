import { AuthRepository } from '../repository/authRepository'
import config from '@/config'
import userRoles from '@/statics/constants/userRoles/userRoles'

const authRepo = AuthRepository

export class AuthUsecase {
  static UserLogin = async (username: string, password: string) => {
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

    return payload
  }

  static ProjectLogin = async (
    username: string,
    password: string | undefined
  ) => {
    const project = await authRepo.FindProjectByUsername(username)
    if (!project) throw new Error(`Could not find project`)

    if (project && !project.password) {
      const secretKey = config.TOKEN_SECRET
      if (!secretKey) {
        throw new Error('passwords do not match')
      }

      const payload = {
        id: project.id,
        name: project.projectName || '',
        role: userRoles.Student,
        firstLogin: 1,
      }

      return payload
    } else if (project && project.password) {
      if (!password) throw new Error(`Password is required`)

      const isMatch = await Bun.password.verify(password, project.password)
      if (!isMatch) throw new Error('passwords do not match')

      const payload = {
        id: project.id,
        name: project.projectName || '',
        role: userRoles.Student,
      }
      return payload
    }
  }
}
