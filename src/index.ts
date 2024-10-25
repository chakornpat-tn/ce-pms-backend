import { PrismaClient } from '@prisma/client'
import app from '@/app'
import * as utils from '@/utils'

const initServer = async () => {
  const port = process.env.PORT || 3000
  const prisma = new PrismaClient()

  try {
    await prisma.$connect() 
    utils.logger.info('Database connection successful!')

    app.listen(port, () => {
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
