import express from 'express'
import * as Project from '../../controllers/v1/ProjectController'

const router = express.Router()

router.get('', Project.ListProjects)
router.get('/:id', Project.FindProjectByID)
router.post('', Project.CreateProject)
router.put('/:id', Project.UpdateProject)
router.delete('/:id', Project.DeleteProject)

export = router
