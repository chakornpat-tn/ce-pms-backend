import Elysia, { t } from 'elysia'
import bearer from '@elysiajs/bearer'
import { ProjectStatusUsecase } from '../usercase/projectStatusUsecase'
import * as middleWare from '@/middleware'
import * as utils from '@/utils'
import { ProjectStatus } from '@prisma/client'
import {
  ListProjectStatusRequest,
  UpdateProjectStatusRequest,
} from '@/models/ProjectStatus'

const title = 'Project Status Controller V1'
const projectStatusUsecase = ProjectStatusUsecase
const projectSwaggerDetail = (summary: string, detail: string) => {
  return {
    tags: ['Project Status'],
    summary: summary,
    detail: detail,
  }
}

export const ProjectStatusDelivery = new Elysia({ prefix: '/project-status' })
  .use(middleWare.JwtConfig)
  .use(bearer())
  .guard({
    beforeHandle: middleWare.checkAuthorization,
  })
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const req = body as ProjectStatus
        await projectStatusUsecase.CreateProjectStatus(req)
        return utils.SuccessMessage(
          title,
          'Create project status successfully.'
        )
      } catch (error) {
        utils.logger.warn(error, 'Create Project Status Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'create project status error.')
      }
    },
    {
      body: t.Object({
        course: t.Optional(t.Number()),
        name: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean()),
      }),
      detail: projectSwaggerDetail(
        'Create Project Status',
        'Create a new project status'
      ),
      
    }
  )
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const listRequest: ListProjectStatusRequest = {
          course: query.course,
          isActive:
            query.isActive === 'true'
              ? true
              : query.isActive === 'false'
              ? false
              : undefined,
          search: query.search,
        }

        const projectStatuses = await projectStatusUsecase.ListProjectStatus(
          listRequest
        )
        return utils.SuccessMessage(
          title,
          'List project status successfully.',
          projectStatuses
        )
      } catch (error) {
        utils.logger.warn(error, 'List Project Status Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'List project status error.')
      }
    },
    {
      query: t.Object({
        course: t.Optional(t.Number()),
        search: t.Optional(t.String()),
        isActive: t.Optional(t.String()),
      }),
      detail: projectSwaggerDetail(
        'List Project Status',
        'Get list of project status'
      ),
      
    }
  )
  .put(
    '/',
    async ({ body, set }) => {
      try {
        const reqData = body as UpdateProjectStatusRequest[]
        if (!reqData[0].course) throw new Error('user bad request')

        await projectStatusUsecase.UpdateProjectStatus(reqData)

        return utils.SuccessMessage(
          title,
          'Update project status successfully.'
        )
      } catch (error) {
        utils.logger.warn(error, 'Update Project Status Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Update project status error.')
      }
    },
    {
      body: t.Array(
        t.Object({
          id: t.Optional(t.Number()),
          name: t.String(),
          course: t.Number(),
          textColor: t.String(),
          bgColor: t.String(),
          isActive: t.Optional(t.Boolean()),
        })
      ),
      detail: projectSwaggerDetail(
        'Update Project Status',
        'Update project status'
      ),
      
    }
  )
  .delete(
    '/:id',
    async ({ params, set }) => {
      try {
        const id = params.id
        if (!id) throw new Error('User bad request')
        await projectStatusUsecase.DeleteProjectStatus(id)
        return utils.SuccessMessage(
          title,
          'Delete project status successfully.'
        )
      } catch (error) {
        utils.logger.warn(error, 'Delete Project Status Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Delete project status error.')
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      detail: projectSwaggerDetail(
        'Delete Project Status',
        'Delete project status By ID'
      ),
      
    }
  )
