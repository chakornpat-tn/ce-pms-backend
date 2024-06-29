import express, { Request, Response } from 'express'
import UserRoutes from '../routes/UserRoutes'
import AuthRoutes from '../routes/AuthRoutes'
import ProjectRoutes from '../routes/ProjectRoutes'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello!!! Welcome to CE-PMS API' })
})

router.use('/user', UserRoutes)
router.use('/auth', AuthRoutes)
router.use('/project', ProjectRoutes)

export default router
