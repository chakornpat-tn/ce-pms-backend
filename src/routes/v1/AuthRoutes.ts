import express from 'express'
import useAuthController from '../../controllers/v1/AuthController'

const router = express.Router()
const authController = useAuthController()

router.post('/login', authController.Login)
// router.post('/login/user', AuthController.ProjectUserLogin)

export = router
