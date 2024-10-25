import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { swagger } from '@elysiajs/swagger'

import api from '@/api'
import bearer from '@elysiajs/bearer'

const app = new Elysia()

//?Load App MiddleWare
app.use(cors())
app.use(
  jwt({
    name: 'jwt',
    secret: process.env.TOKEN_SECRET || 'secret-key',
    exp: '3h',
  })
)
app.use(bearer())
app.use(swagger())

//? Routes
app.use(api)

export default app