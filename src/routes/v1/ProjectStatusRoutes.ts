import express from 'express'
import useProjectStatusController from '@/controllers/v1/ProjectStatusController'

const router = express.Router()
const projectStatusController = useProjectStatusController()

router.get('', projectStatusController.ListProjectStatus)
router.put('', projectStatusController.UpdateProjectStatus)
router.post('', projectStatusController.CreateProjectStatus)
router.delete('/:id', projectStatusController.DeleteProjectStatus)

export = router
