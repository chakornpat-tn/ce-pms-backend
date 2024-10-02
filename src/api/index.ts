import express, { Request, Response } from 'express'
import UserRoutes from '@/routes/v1/UserRoutes'
import AuthRoutes from '@/routes/v1/AuthRoutes'
import ProjectRoutes from '@/routes/v1/ProjectRoutes'

const router = express.Router()
const v1Router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello!!! Welcome to CE-PMS API' })
})

v1Router.use('/user', UserRoutes)
v1Router.use('/auth', AuthRoutes)
v1Router.use('/project', ProjectRoutes)

router.use('/v1', v1Router)

export default router
