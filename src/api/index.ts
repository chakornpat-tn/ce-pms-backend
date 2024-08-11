import express, { Request, Response } from 'express'
import UserRoutes from '../routes/UserRoutes'
import AuthRoutes from '../routes/AuthRoutes'
import ProjectRoutes from '../routes/ProjectRoutes'

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
