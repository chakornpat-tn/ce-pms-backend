import User from '../../models/User'
import Project from '../../models/Project'
export interface IUser {
  _id: string
  name: string
  password: string
  role: string
}

export interface IProjectRes {
  _id: string
  username: string
  password: string
  title: string
}

export const FindUserByUsername = async (
  username: string
): Promise<IUser | null> => {
  return (await User.findOne({ username: username }).lean()) as IUser | null
}

export const FindProjectByUsername = async (username: string) => {
  return (await Project.findOne({
    username: username,
  }).lean()) as IProjectRes | null
}
