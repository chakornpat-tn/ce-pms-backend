import express from 'express'
import useAuthController from '../../controllers/v1/AuthController'

const router = express.Router()
const authController = useAuthController()

router.post('/login', authController.User)
router.post('/login/project', authController.Project)

export = router
