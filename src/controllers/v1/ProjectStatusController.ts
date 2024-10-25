import { Context } from 'elysia'
import * as utils from '@/utils'
import {
  ProjectStatus,
  UpdateProjectStatusRequest,
  ListProjectStatusRequest,
} from '@/models/ProjectStatus'
import useProjectStatusRepository from '@/repositories/v1/ProjectStatusRepository'

const title = 'ProjectStatus Controller V1'
const projectStatusRepo = useProjectStatusRepository()

const useProjectStatusController = () => {
  const CreateProjectStatus = async ({ body, set }: Context) => {
    try {
      const req = body as ProjectStatus
      if (!req.course) throw new Error('course is required')
      await projectStatusRepo.CreateProjectStatus(req)

      return utils.SuccessMessage(title, 'create project status successfully.')
    } catch (error) {
      utils.logger.warn(error, 'Create Project Status Controller Error')
      set.status = 500
      return utils.ErrorMessage(title, 'create project status error.')
    }
  }

  const ListProjectStatus = async ({ query, set }: Context) => {
    try {
      const course = query.course ? parseInt(query.course as string) : undefined
      const listRequest : ListProjectStatusRequest = {
        course: course,
        isActive: query.isActive
          ? (query.isActive as string) === 'true'
          : undefined,
        search: query.search ? (query.search as string) : undefined,
      }

      const projectStatuses = await projectStatusRepo.ListProjectStatus(listRequest)
      return utils.SuccessMessage(
        title,
        'list project status successfully.',
        projectStatuses
      )
    } catch (error) {
      utils.logger.warn(error, 'List Project Status Controller Error')
      set.status = 500
      return utils.ErrorMessage(title, 'list project status error.')
    }
  }

  const UpdateProjectStatus = async ({ body, set }: Context) => {
    try {
      const reqData = body as UpdateProjectStatusRequest[]
      if (!reqData[0].course) throw new Error('user bad request')

      await projectStatusRepo.UpdateProjectStatus(reqData)

      return utils.SuccessMessage(title, 'update project status successfully.')
    } catch (error) {
      utils.logger.warn(error, 'Update Project Status Controller Error')
      set.status = 500
      return utils.ErrorMessage(title, 'update project status error.')
    }
  }

  const DeleteProjectStatus = async ({ params, set }: Context) => {
    try {
      const id = Number(params.id)
      if (!id) throw new Error('user bad request')

      await projectStatusRepo.DeleteProjectStatus(id)

      return utils.SuccessMessage(title, 'delete project status successfully.')
    } catch (error) {
      utils.logger.warn(error, 'Delete Project Status Controller Error')
      set.status = 500
      return utils.ErrorMessage(title, 'delete project status error.')
    }
  }
  return {
    CreateProjectStatus,
    ListProjectStatus,
    UpdateProjectStatus,
    DeleteProjectStatus,
  }
}

export default useProjectStatusController