import { Elysia, t } from 'elysia'
import useProjectController from '@/controllers/v1/ProjectController'

const projectRoutes = new Elysia({ prefix: '/project' })
const projectController = useProjectController()

projectRoutes
  .get('/', projectController.ListProjects)
  .get('/:id', projectController.GetProjectById)
  .post('/', projectController.CreateProject)
  .patch('/:id', projectController.UpdateProject)
  .patch('/', projectController.UpdateProjects)
  .delete('/:id', projectController.DeleteProject)

export default projectRoutes