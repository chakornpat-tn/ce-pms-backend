export interface User {
  id: number
  name: string
  username: string
  password: string
  role: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
