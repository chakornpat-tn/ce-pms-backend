import { Elysia } from 'elysia'
import useProjectStatusController from '@/controllers/v1/ProjectStatusController'

const projectStatusRoutes = new Elysia()
const projectStatusController = useProjectStatusController(projectStatusRoutes)

projectStatusRoutes.group('/project-status', app => app
  .use(projectStatusController.ListProjectStatus)
  .use(projectStatusController.UpdateProjectStatus)
  .use(projectStatusController.CreateProjectStatus)
  .use(projectStatusController.DeleteProjectStatus)
)

export default projectStatusRoutes