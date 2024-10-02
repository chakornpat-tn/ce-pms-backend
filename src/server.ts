import app from './app'
import { PrismaClient } from '@prisma/client'
export const startServer = async () => {
  try {
    await initDatabase()
    startAppListener()
  } catch (error) {
    handleServerError(error)
  }
}

const initDatabase = async () => {
  const prisma = new PrismaClient()
  try {
    await prisma.$connect()
    console.info('Database connection successful!')
  } catch (error) {
    console.error('Error connecting to the database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

const startAppListener = () => {
  app?.listen(process.env.PORT, () => {
    console.info(`app listening on port ${process.env.PORT}`)
  })
}

const handleServerError = (error: unknown) => {
  console.error('Error starting server:', (error as Error).message)
  process.exit(1)
}

startServer()

export default app
