import express from 'express'
import * as AuthController from '../controllers/AuthController'

const router = express.Router()

router.post('/login', AuthController.Login)
router.post('/login/user', AuthController.ProjectUserLogin)

export = router
