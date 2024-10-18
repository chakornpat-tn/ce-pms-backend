import express, { Request, Response } from 'express'
import UserRoutes from '@/routes/v1/UserRoutes'
import AuthRoutes from '@/routes/v1/AuthRoutes'
import ProjectRoutes from '@/routes/v1/ProjectRoutes'
import ProjectStatusRoutes from '@/routes/v1/ProjectStatusRoutes'
import DocumentRoutes from '@/routes/v1/DocumentRoutes'

const router = express.Router()
const v1Router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello!!! Welcome to CE-PMS API' })
})

v1Router.use('/user', UserRoutes)
v1Router.use('/auth', AuthRoutes)
v1Router.use('/project', ProjectRoutes)
v1Router.use('/project-status', ProjectStatusRoutes)
v1Router.use('/document',DocumentRoutes)

router.use('/v1', v1Router)

export default router
