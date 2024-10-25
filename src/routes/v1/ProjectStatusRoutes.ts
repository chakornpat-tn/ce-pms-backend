import { Elysia, t } from 'elysia'
import useProjectStatusController from '@/controllers/v1/ProjectStatusController'

const projectStatusRoutes = new Elysia({ prefix: '/project-status' })
const projectStatusController = useProjectStatusController()

projectStatusRoutes
  .get('/', projectStatusController.ListProjectStatus)
  .put('/', projectStatusController.UpdateProjectStatus)
  .post('/', projectStatusController.CreateProjectStatus)
  .delete('/:id', projectStatusController.DeleteProjectStatus)

export default projectStatusRoutes