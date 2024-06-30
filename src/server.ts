import app from './app'
import InitDB from './utils/database/config'

// mongoDB and Starting server
export const startServer = async () => {
  try {
    const conn = await InitDB(process.env.MONGO_CONNECT_URI)
    console.log(`MongoDB database connection ${conn?.connection?.host}`)

    app?.listen(process.env.PORT, () => {
      console.log(`app listening on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.log('MongoDB connection error :', (error as Error).message)
  }
}

startServer()

export default app
