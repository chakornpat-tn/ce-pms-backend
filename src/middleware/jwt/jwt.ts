import { jwt } from '@elysiajs/jwt'

export const JwtConfig = jwt({
  name: 'jwt',
  secret: process.env.TOKEN_SECRET || 'secret-key',
  exp: '3h',
})
