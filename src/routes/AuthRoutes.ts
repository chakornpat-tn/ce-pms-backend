import express from 'express'
import useAuthController from '../controllers/AuthController'

const router = express.Router()
const authController = useAuthController()

router.post('/login', authController.Login)
// router.post('/login/user', AuthController.ProjectUserLogin)

export = router
