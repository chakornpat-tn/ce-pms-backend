import mongoose from 'mongoose'

export const InitDB = (mongoURI: string | undefined) => {
  // mongoose.set('debug', true)
  return mongoose.connect(mongoURI || '')
}

export default InitDB
