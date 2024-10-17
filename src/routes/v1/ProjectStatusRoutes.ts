import express from 'express'
import useProjectStatusController from '@/controllers/v1/ProjectStatusController'

const router = express.Router()
const projectStatusController = useProjectStatusController()

router.post('', projectStatusController.ListProjectStatus)
router.post('/update', projectStatusController.CreateOrUpdateProjectStatus)

export = router
