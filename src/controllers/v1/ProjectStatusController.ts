import { Request, Response } from 'express'
import * as utils from '@/utils'
import {
  CreateOrUpdateProjectStatusRequest,
  ListProjectStatusRequest,
} from '@/models/ProjectStatus'
import useProjectStatusRepository from '@/repositories/v1/ProjectStatusRepository'

const title = 'ProjectStatus Controller V1'
const projectStatusRepo = useProjectStatusRepository()

const useProjectStatusController = () => {
  const ListProjectStatus = async (req: Request, res: Response) => {
    try {
      const reqData: ListProjectStatusRequest = req.body
      if (!reqData.course) throw new Error('user bad request')
      else reqData.course = Number(reqData.course)

      const projectStatuses = await projectStatusRepo.ListProjectStatus(reqData)
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
      res.json(utils.ErrorMessage(title, 'list project status error.'))
    }
  }

  const CreateOrUpdateProjectStatus = async (req: Request, res: Response) => {
    try {
      const reqData: CreateOrUpdateProjectStatusRequest[] = req.body
      if (!reqData[0].course) throw new Error('user bad request')

      await projectStatusRepo.CreateOrUpdateProjectStatus(reqData)

      res
        .status(200)
        .json(
          utils.SuccessMessage(
            title,
            'create or update project status successfully.'
          )
        )
    } catch (error) {
      utils.logger.warn(
        error,
        'Create or Update Project Status Controller Error'
      )
      res.json(
        utils.ErrorMessage(title, 'create or update project status error.')
      )
    }
  }

  return {
    ListProjectStatus,
    CreateOrUpdateProjectStatus,
  }
}

export default useProjectStatusController
