import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// Import Routes
import api from './api'

//? Initialize app with express
const app: express.Application | undefined = express()

//? Load App Middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

//? Routes
app.use('/', api)

export default app
