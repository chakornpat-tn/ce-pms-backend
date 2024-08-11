import User from '../../models/User'
import bcrypt from 'bcrypt'

const saltRounds = Number(process.env.SALT_ROUNDS)

export const GetUsers = async (filter: any, page: number, perPage: number) => {
  const users = await User.find(filter)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort('role')
    .exec()

  return users
}

export const CountUsers = async (filter: any) => {
  const totalResult = await User.countDocuments(filter)
  return totalResult
}

export const FindUserById = async (id: string) => {
  const user = await User.findById(id)
  return user
}

export const DeleteUserById = async (id: string) => {
  const user = await User.findByIdAndDelete(id)
  return user
}

export const UpdateUserById = async (id: string, userData: any) => {
  if (userData.password) {
    userData.password = await bcrypt.hashSync(userData.password, saltRounds)
  }

  const updatedData = [{ _id: id }, { ...userData }, { new: true }]
  const result = await User.findOneAndUpdate(...updatedData)

  return result
}

export const CreateUser = async (userData: any) => {
  if (!userData.password) {
    throw new Error('Password is required')
  }

  const passwordHash = await bcrypt.hashSync(userData.password, saltRounds)
  userData.password = passwordHash

  const user = new User({ ...userData })
  await user.save()

  return user
}
