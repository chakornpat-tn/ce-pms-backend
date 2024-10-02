import { Request, Response } from 'express'
import { encrypt } from '../../utils/JWT/jwt'
import bcrypt from 'bcrypt'
import useAuthRepository from '../../repositories/v1/AuthRepository'
import utils from '@/utils/Response/response'

const authRepo = useAuthRepository()

const title = 'Auth Controller V1'

const useAuthController = () => {
  const Login = async (req: Request, res: Response) => {
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
        return res
          .status(500)
          .json(utils.ErrorMessage(title, 'secret key not found'))
      }

      const { password: _, ...payload } = result

      const token = await encrypt(payload)

      return res
        .status(200)
        .json(utils.SuccessMessage(title, 'login successfully', { token }))
    } catch (error) {
      console.warn('useAuthController.Login error :', error)
      return res
        .status(401)
        .json(utils.UnauthorizedMessage(title))
    }
  }
  return {
    Login,
  }
}

export default useAuthController
// export const ProjectUserLogin = async (req: Request, res: Response) => {
//   try {
//     const { username, password } = req.body as {
//       username: string
//       password: string
//     }

//     const secretKey = process.env.TOKEN_SECRET
//     if (!secretKey) {
//       return res.status(500).json({ error: 'TOKEN_SECRET is not defined' })
//     }

//     const user = await AuthRepo.FindProjectByUsername(username)

//     if (!user) {
//       throw new Error(`Could not find user: ${username}`)
//     }

//     if (!user.password && user._id && !password) {
//       const payload = {
//         id: user._id,
//         name: user.title,
//         role: 4,
//         newProject: true,
//       }

//       return res.status(200).json({
//         token: await encrypt(payload),
//       })
//     }

//     if (!bcrypt.compareSync(password, user.password)) {
//       throw new Error('Incorrect password')
//     }

//     const payload = {
//       id: user._id,
//       name: user.title,
//       role: 4,
//     }

//     const token = await encrypt(payload)

//     return res.status(200).json({
//       token: token,
//     })
//   } catch (error) {
//     return res.status(401).json({ message: (error as Error).message })
//   }
// }
