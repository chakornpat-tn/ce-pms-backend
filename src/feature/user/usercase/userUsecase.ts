import { UserRepository } from '../repository/userRepository'
import { User } from '@prisma/client'
import config from '@/config'

const userRepo = UserRepository

export class UserUsecase {
  static ListUser = async (
    page: number,
    perPage: number,
    search?: string,
    roleFilter?: number
  ) => {
    const { totalCount, users } = await userRepo.GetUsers(
      page,
      perPage,
      search,
      roleFilter
    )
    return { totalCount, users }
  }

  static FindUserByID = async (id: number) => {
    const user = await userRepo.FindUserByID(id)
    return user
  }

  static DeleteUserByID = async (id: number) => {
    const user = await userRepo.DeleteUserByID(id)
    return user
  }

  static UpdateUserByID = async (id: number, userData: User) => {
    if (userData.password) {
      const passwordHash = await Bun.password.hash(userData.password, {
        algorithm: 'bcrypt',
        cost: config.SALT_ROUNDS,
      })
      userData.password = passwordHash
    }
    const updatedUser = await userRepo.UpdateUserByID(id, userData)
    return updatedUser
  }

  static CreateUser = async (userData: User) => {
    const passwordHash = await Bun.password.hash(userData.password, {
      algorithm: 'bcrypt',
      cost: config.SALT_ROUNDS,
    })
    userData.password = passwordHash

    const user = await userRepo.CreateUser(userData)
    return user
  }
}