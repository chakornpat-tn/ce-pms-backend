import { Request, Response } from 'express'
import User from '../models/User'
import { encrypt } from '../utils/JWT/jwt'
import bcrypt from 'bcrypt'

interface IUser {
  _id: string
  name: string
  password: string
  role: string
}

export const Login = async (req: Request, res: Response) => {
  try {
    const { username, password, asTeacherLogin } = req.body as {
      username: string
      password: string
      asTeacherLogin: boolean
    }
    let result: IUser | null = null

    if (asTeacherLogin) {
      result = (await User.findOne({
        username: username,
      }).lean()) as IUser | null
    } else {
    }

    if (result) {
      if (!bcrypt.compareSync(password, result.password))
        throw new Error('passwords do not match')
    } else throw new Error(`Could not find:${username}`)

    const secretKey = process.env.TOKEN_SECRET || undefined
    if (!secretKey) {
      res.status(500).json({ error: 'TOKEN_SECRET is not defined' })
    }

    const payload = {
      id: result._id,
      name: result.name,
      role: result.role,
    }

    const token = await encrypt(payload)

    res.status(200).json({
      token: token,
    })
  } catch (error) {
    res.status(401).json({ message: 'login failed wrong username or password' })
  }
}
