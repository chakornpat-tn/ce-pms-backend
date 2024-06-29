import express from 'express'
import * as User from '../controllers/UserController'
import { HelloMiddleware } from '../middlewares/authCheck'

const router = express.Router()

router.get('', HelloMiddleware, User.ListUsers)
router.get('/:id', User.FindUserByID)
router.put('/:id', User.UpdateUser)
router.delete('/:id', User.DeleteUserByID)
router.post('', User.CreateUser)

export = router
