import { Elysia } from 'elysia'
import useProjectController from '@/controllers/v1/ProjectController'

const projectApp = new Elysia()
const projectController = useProjectController(projectApp)

projectApp.group('/project', app => app
  .use(projectController.CreateProject)
  .use(projectController.ListProjects)
  .use(projectController.GetProjectById)
  .use(projectController.DeleteProject)
  .use(projectController.UpdateProjects)
  .use(projectController.UpdateProject)
)

export default projectApp
