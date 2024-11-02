import { PrismaClient } from '@prisma/client'
import config from '@/config'
import app from '@/app'
import * as utils from '@/utils'

const initServer = async () => {
  const prisma = new PrismaClient()

  try {
    await prisma.$connect() 
    utils.logger.info('Database connection successful!')

    app.listen(config.PORT, () => {
      utils.logger.info(
        `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
      )
    })
  } catch (error) {
    utils.logger.fatal(error, 'Failed to start server')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

initServer()
