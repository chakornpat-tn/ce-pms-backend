import mongoose from 'mongoose'

export const InitDB = (mongoURI: string | undefined) => {
  return mongoose.connect(mongoURI || '')
}

export default InitDB
