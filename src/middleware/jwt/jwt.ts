import { jwt } from '@elysiajs/jwt'
import config from '@/config'

export const JwtConfig = jwt({
  name: 'jwt',
  secret: config.TOKEN_SECRET,
  exp: '3h',
})
