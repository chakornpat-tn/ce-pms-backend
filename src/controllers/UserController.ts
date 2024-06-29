import { Request, Response } from 'express'
import { Error } from 'mongoose'
import bcrypt from 'bcrypt'
import User from '../models/User'

const saltRounds = Number(process.env.SALT_ROUNDS)
const salt = bcrypt.genSaltSync(saltRounds)

export const ListUsers = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1
    const perPage: number = parseInt(req.query.perPage as string) || 20
    const { name, username } = req.query

    let filter: any = {}
    if (name) {
      filter.name = { $regex: new RegExp(name as string, 'i') }
    }

    if (username) {
      filter.username = { $regex: new RegExp(username as string, 'i') }
    }

    const users = await User.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const FindUserByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const DeleteUserByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)
    res.json({ message: 'Deleted user successfully!' })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    let user = req.body

    if (user.username) throw new Error(`cannot change username`)

    if (!!user?.password)
      user.password = await bcrypt.hashSync(user.password, saltRounds)
    const updatedData = [{ _id: id }, { ...user }, { new: true }]
    const result = await User.findOneAndUpdate(...updatedData)

    res.json({ message: 'updated user : ' + result?.name })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const CreateUser = async (req: Request, res: Response) => {
  try {
    // GET USER DATA
    const userData = req.body

    // Hash Password
    if (userData.password == undefined) throw new Error('required password')
    const passwordHash = await bcrypt.hashSync(userData.password, salt)
    userData.password = passwordHash

    const user = new User({
      ...userData,
    })
    // Create User
    await user.save()
    res
      .status(201)
      .json({ message: 'created successfully user : ' + user?.name })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}
