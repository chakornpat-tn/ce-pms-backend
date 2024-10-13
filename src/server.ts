import app from './app'
import { PrismaClient } from '@prisma/client'
import * as utils from '@/utils'
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
    utils.logger.info('Database connection successful!')
  } catch (error) {
    utils.logger.fatal(error,'Error connecting to the database:' )
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

const startAppListener = () => {
  app?.listen(process.env.PORT, () => {
    utils.logger.info(`app listening on port ${process.env.PORT}`)
  })
}

const handleServerError = (error: unknown) => {
  utils.logger.fatal(error as Error, 'Failed to start server')
  process.exit(1)
}

startServer()

export default app
