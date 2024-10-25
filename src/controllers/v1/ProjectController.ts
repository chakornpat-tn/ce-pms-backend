import { Context } from 'elysia'
import useProjectRepository from '@/repositories/v1/ProjectRepository'
import * as utils from '@/utils'
import {
  CreateProjectRequest,
  UpdateProjectRequest,
  ListProjectsFilter,
  UpdateProjectsRequest,
} from '@/models/Project'

const title = 'Project Controller V1'
const projectRepo = useProjectRepository()
const saltRounds = Number(process.env.SALT_ROUNDS)

const useProjectController = () => {
  const CreateProject = async ({
    jwt,
    bearer,
    body,
    set,
    request,
  }: Context & { bearer: string,jwt:any }) => {
    try {
      const payload = await jwt.verify(bearer)
      if (!payload) throw new Error(`Invalid token`)

      let req = body as CreateProjectRequest
      const filteredUsers = req.users
        ? req.users.filter((userId) => userId !== payload.id)
        : []
      req.users =
        req.users?.length > 0
          ? [payload.id, filteredUsers[0]].slice(0, 2)
          : [payload.id]

      req.academicYear = req.academicYear || new Date().getFullYear() + 543
      req.semester = req.semester || 1
      req.username = await utils.generateUsername()

      await projectRepo.CreateProject(req)
      return utils.SuccessMessage(title, 'Project created successfully')
    } catch (error) {
      utils.logger.warn(error as Error, 'ProjectController.CreateProject Error')
      set.status = 500
      return utils.ErrorMessage(title, 'Failed to create project')
    }
  }

  const ListProjects = async ({ query, set }: Context) => {
    try {
      const filter: ListProjectsFilter = {
        academicYear: Number(query.academicYear),
        semester: Number(query.semester),
        projectStatus: Number(query.projectStatus) || undefined,
        projectName: (query.projectName as string) || undefined,
      }
      const projects = await projectRepo.ListProjects(filter)
      return utils.SuccessMessage(
        title,
        'Projects retrieved successfully',
        projects
      )
    } catch (error) {
      utils.logger.warn(error as Error, 'ProjectController.ListProjects Error')
      set.status = 500
      return utils.ErrorMessage(title, 'Failed to retrieve projects')
    }
  }

  const GetProjectById = async ({ params, set }: Context) => {
    try {
      const projectId = parseInt(params.id)
      const project = await projectRepo.GetProjectById(projectId)
      if (!project) {
        set.status = 404
        return utils.NotFoundMessage(
          'Project not found',
          'The requested project does not exist'
        )
      }
      return utils.SuccessMessage(
        title,
        'Project retrieved successfully',
        project
      )
    } catch (error) {
      utils.logger.warn(
        error as Error,
        'ProjectController.GetProjectById Error'
      )
      set.status = 500
      return utils.ErrorMessage(title, 'Failed to retrieve project')
    }
  }

  const UpdateProject = async ({ params, body, set }: Context) => {
    try {
      let req = body as UpdateProjectRequest
      req.id = parseInt(params.id, 10)

      if (req.password) {
        req.password = await Bun.password.hash(req.password, {
          algorithm: 'bcrypt',
          cost: saltRounds,
        })
      }

      await projectRepo.UpdateProject(req)
      return utils.SuccessMessage(title, 'Project updated successfully')
    } catch (error) {
      utils.logger.warn(error as Error, 'ProjectController.UpdateProject Error')
      set.status = 500
      return utils.ErrorMessage(title, 'Failed to update project')
    }
  }

  const UpdateProjects = async ({ body, set }: Context) => {
    try {
      const req = body as UpdateProjectsRequest
      await projectRepo.UpdateProjects(req)
      return utils.SuccessMessage(title, 'Projects updated successfully')
    } catch (error) {
      utils.logger.warn(
        error as Error,
        'ProjectController.UpdateProjects Error'
      )
      set.status = 500
      return utils.ErrorMessage(title, 'Failed to update projects')
    }
  }

  const DeleteProject = async ({ params, set }: Context) => {
    try {
      const projectId = parseInt(params.id)
      const deletedProject = await projectRepo.DeleteProject(projectId)
      if (!deletedProject) {
        set.status = 404
        return utils.NotFoundMessage(
          'Project not found',
          'The requested project does not exist'
        )
      }
      return utils.SuccessMessage(title, 'Project deleted successfully')
    } catch (error) {
      utils.logger.warn(error as Error, 'ProjectController.DeleteProject Error')
      set.status = 500
      return utils.ErrorMessage(title, 'Failed to delete project')
    }
  }

  return {
    CreateProject,
    ListProjects,
    GetProjectById,
    UpdateProject,
    UpdateProjects,
    DeleteProject,
  }
}

export default useProjectController
