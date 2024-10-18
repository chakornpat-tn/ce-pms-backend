import { Request, Response } from 'express'
import * as utils from '@/utils'
import {
  UpdateProjectStatusRequest,
  ListProjectStatusRequest,
} from '@/models/ProjectStatus'
import useProjectStatusRepository from '@/repositories/v1/ProjectStatusRepository'

const title = 'ProjectStatus Controller V1'
const projectStatusRepo = useProjectStatusRepository()

const useProjectStatusController = () => {
  const CreateProjectStatus = async (req: Request, res: Response) => {
    try {
      const reqData = req.body
      if (!reqData.course) throw new Error('course is required')
      await projectStatusRepo.CreateProjectStatus(reqData)

      res
        .status(200)
        .json(
          utils.SuccessMessage(title, 'create project status successfully.')
        )
    } catch (error) {
      utils.logger.warn(error, 'Create Project Status Controller Error')
      res.status(500).json(utils.ErrorMessage(title, 'create project status error.'))
    }
  }

  const ListProjectStatus = async (req: Request, res: Response) => {
    try {
      const course = req.query.course ? parseInt(req.query.course as string) : undefined
      const listRequest : ListProjectStatusRequest = {
        course: course,
        isActive: req.query.isActive
          ? (req.query.isActive as string) === 'true'
          : undefined,
        search: req.query.search ? (req.query.search as string) : undefined,
      }

      const projectStatuses = await projectStatusRepo.ListProjectStatus(listRequest)
      res
        .status(200)
        .json(
          utils.SuccessMessage(
            title,
            'list project status successfully.',
            projectStatuses
          )
        )
    } catch (error) {
      utils.logger.warn(error, 'List Project Status Controller Error')
      res.status(500).json(utils.ErrorMessage(title, 'list project status error.'))
    }
  }

  const UpdateProjectStatus = async (req: Request, res: Response) => {
    try {
      const reqData: UpdateProjectStatusRequest[] = req.body
      if (!reqData[0].course) throw new Error('user bad request')

      await projectStatusRepo.UpdateProjectStatus(reqData)

      res
        .status(200)
        .json(
          utils.SuccessMessage(title, 'update project status successfully.')
        )
    } catch (error) {
      utils.logger.warn(error, 'Update Project Status Controller Error')
      res.status(500).json(utils.ErrorMessage(title, 'update project status error.'))
    }
  }

  const DeleteProjectStatus = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (!id) throw new Error('user bad request')

      await projectStatusRepo.DeleteProjectStatus(id)

      res
        .status(200)
        .json(
          utils.SuccessMessage(title, 'delete project status successfully.')
        )
    } catch (error) {
      utils.logger.warn(error, 'Delete Project Status Controller Error')
      res.status(500).json(utils.ErrorMessage(title, 'delete project status error.'))
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
