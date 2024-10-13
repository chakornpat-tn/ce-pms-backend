import express from 'express'
import ProjectController from '@/controllers/v1/ProjectController'

const router = express.Router()
const projectController = ProjectController()

router.get('', projectController.ListProjects)
router.get('/:id', projectController.GetProjectById)
router.post('',projectController.CreateProject)
router.put('/:id', projectController.UpdateProject)
router.delete('/:id', projectController.DeleteProject)

export = router
