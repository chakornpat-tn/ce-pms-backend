import Mongoose from 'mongoose'

const schema = new Mongoose.Schema(
  {
    name: String,
    username: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: String,
    role: { type: Number, enum: [1, 2, 3], default: 3 },
  },
  { timestamps: true }
)

export default Mongoose.model('User', schema)

export interface User {
  name: string
  username: string
  password: string
  role: number
}

export interface AdvisorRequest {
  id: string 
}
