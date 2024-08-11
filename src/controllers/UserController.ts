import { Request, Response } from 'express'
import * as UserRepo from '../repositories/v1/UserRepository'
import { Error } from 'mongoose'

export const ListUsers = async (req: Request, res: Response) => {
  try {
    let page: number = parseInt(req.query.page as string)
    let perPage: number = parseInt(req.query.perPage as string)
    const role: number = parseInt(req.query.role as string)
    const { name, username } = req.query

    let filter: any = {}

    if (perPage <= 0) perPage = 30
    if (page <= 0) page = 1
    if (name) {
      filter.name = { $regex: new RegExp(name as string, 'i') }
    }

    if (username) {
      filter.username = { $regex: new RegExp(username as string, 'i') }
    }

    if (role && !isNaN(Number(role))) {
      filter.role = Number(role)
    }

    const totalResult = await UserRepo.CountUsers(filter)
    const users = await UserRepo.GetUsers(filter, page, perPage)

    res.json({ totalResult, users })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const FindUserByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await UserRepo.FindUserById(id)
    if (user) {
      res.json(user)
    } else {
      res.status(404)
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const DeleteUserByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await UserRepo.DeleteUserById(id)
    if (user) {
      res.status(200)
    } else {
      res.status(404)
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = req.body

    if (user.username) throw new Error(`cannot change username`)

    const result = await UserRepo.UpdateUserById(id, user)

    res.json({ message: 'Updated user: ' + result?.name })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const CreateUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body
    const user = await UserRepo.CreateUser(userData)

    res
      .status(200)
      .json({ message: 'Created successfully user: ' + user?.name })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}
