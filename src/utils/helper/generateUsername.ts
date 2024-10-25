import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const generateUsername = async (): Promise<string> => {
  const now = new Date()
  const currentYear = now.getFullYear() + 543

  const randomNumber = Math.floor(Math.random() * 1000)
  const formattedNumber = randomNumber.toString().padStart(3, '0')
  const randomUsername = `cpe${currentYear}-${formattedNumber}`
  const existingUser = await prisma.user.findUnique({ where: { username: randomUsername } })

  if (existingUser) {
    return generateUsername()
  }

  return randomUsername
}

export { generateUsername }
