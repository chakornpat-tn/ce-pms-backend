import express from 'express'
import UserController from '@/controllers/v1/UserController'
import { HelloMiddleware } from '@/middlewares/authCheck'

const router = express.Router()
const useUserController = UserController()

router.get('', HelloMiddleware, useUserController.ListUsers)
router.get('/:id', useUserController.FindUserByID)
router.put('/:id', useUserController.UpdateUser)
router.delete('/:id', useUserController.DeleteUserByID)
router.post('', useUserController.CreateUser)

export = router
