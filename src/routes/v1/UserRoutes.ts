import express from 'express'
import useUserController from '@/controllers/v1/UserController'
import { HelloMiddleware } from '@/middlewares/authCheck'

const router = express.Router()
const userController = useUserController()

router.get('', HelloMiddleware, userController.ListUsers)
router.get('/:id', userController.FindUserByID)
router.put('/:id', userController.UpdateUser)
router.delete('/:id', userController.DeleteUserByID)
router.post('', userController.CreateUser)

export = router
