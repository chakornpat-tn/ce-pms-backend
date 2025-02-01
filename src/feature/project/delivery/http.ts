import Elysia, { t } from 'elysia'
import bearer from '@elysiajs/bearer'
import { ProjectUsecase } from '../usercase/projectUsecase'
import * as middleWare from '@/middleware'
import * as utils from '@/utils'
import {
  CreateProjectRequest,
  ListProjectsFilter,
  UpdateProjectRequest,
  UpdateProjectsRequest,
} from '@/models/Project'
import course from '@/statics/constants/course/course'

const title = 'Project Controller V1'
const projectUsecase = ProjectUsecase
const projectSwaggerDetail = (summary: string, detail: string) => {
  return {
    tags: ['Project'],
    summary: summary,
    detail: detail,
  }
}

export const ProjectDelivery = new Elysia({ prefix: '/project' })
  .get(
    '/max-academic-year',
    async () => {
      try {
        const projectAcademicYear = await projectUsecase.GetMaxProjectAcademicYear()
        return utils.SuccessMessage(
          title,
          'ProjectController.GetMaxProjectAcademicYear successfully',
          projectAcademicYear
        )
      } catch (error) {
        utils.logger.warn(
          error as Error,
          'ProjectController.GetMaxProjectAcademicYear Error'
        )
        return utils.ErrorMessage(
          title,
          'ProjectController.GetMaxProjectAcademicYear Error'
        )
      }
    },
    {
      detail: {
        ...projectSwaggerDetail(
          'Get Max Project Academic Year',
          'get max project academic year'
        ),
       
      },
    }
  )
  .use(middleWare.JwtConfig)
  .use(bearer())
  // .guard({
  //   beforeHandle: middleWare.checkAuthorization,
  // })
  .get(
    '/pass-pre',
    async ({ query, set }) => {
      try {
        const filter: ListProjectsFilter = {
          academicYear: query.academicYear,
          semester: query.semester,
          projectName: query.projectName || undefined,
        }
        const projects = await projectUsecase.ListProjectPassPre(filter)
        return utils.SuccessMessage(
          title,
          'ProjectController.ListProjectPassPre successfully',
          projects
        )
      } catch (error) {
        utils.logger.warn(
          error as Error,
          'ProjectController.ListProjectPassPre Error'
        )
        set.status = 500
        return utils.ErrorMessage(title, 'Failed List Projects Pass Pre')
      }
    },
    {
      query: t.Object({
        academicYear: t.Optional(t.Number()),
        semester: t.Optional(t.Number()),
        projectName: t.Optional(t.String()),
      }),
      detail: {
        ...projectSwaggerDetail(
          'List project pass pre',
          'Get a list of projects pass pre with optional filters'
        ),
        parameters: [
          {
            name: 'courseStatus, projectStatus',
            in: 'query',
            required: false,
            description:
              'Array of course status IDs. Use comma to separate multiple IDs (e.g., 1,2).',
          },
        ],
      },
    }
  )
  .post(
    '/',
    async ({ jwt, bearer, body, set }) => {
      try {
        const payload = await jwt.verify(bearer)
        if (!payload) throw new Error(`Invalid token`)

        let req = body as CreateProjectRequest
        const filteredUsers = req.users
          ? req.users.filter((user) => user.userId != payload.id)
          : []

        req.users = [
          {
            userId: Number(payload.id),
            userProjectRole: 1,
          },
          ...(filteredUsers.length > 0 ? [filteredUsers[0]] : []),
        ].slice(0, 2)

        await projectUsecase.CreateProject(req)
        return utils.SuccessMessage(title, 'Project created successfully')
      } catch (error) {
        utils.logger.warn(
          error as Error,
          'ProjectController.CreateProject Error'
        )
        set.status = 500
        return utils.ErrorMessage(title, 'Failed to create project')
      }
    },
    {
      body: t.Object({
        projectName: t.String(),
        projectNameEng: t.Optional(t.String()),
        abstract: t.Optional(t.String()),
        abstractEng: t.Optional(t.String()),
        detail: t.Optional(t.String()),
        detailEng: t.Optional(t.String()),
        semester: t.Optional(t.Number()),
        academicYear: t.Number(),
        type: t.Optional(t.String()),
        projectStatusId: t.Optional(t.Number()),
        students: t.Optional(
          t.Array(
            t.Object({
              studentId: t.String(),
              name: t.String(),
            })
          )
        ),
        users: t.Optional(
          t.Array(
            t.Object({
              userId: t.Number(),
              userProjectRole: t.Number(),
            })
          )
        ),
        password: t.Optional(t.String()),
      }),
      detail: projectSwaggerDetail(
        'Create a new project',
        'Create a new project'
      ),
    }
  )
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const filter: ListProjectsFilter = {
          academicYear: query.academicYear,
          semester: query.semester,
          projectStatus: query.projectStatus
            ? query.projectStatus.split(',').map(Number)
            : undefined,
          projectName: query.projectName || undefined,
          courseStatus: query.courseStatus
            ? query.courseStatus.split(',').map(Number)
            : undefined,
          projectAcademicYear: query.projectAcademicYear,
          projectSemester: query.projectSemester,
        }
        const projects = await projectUsecase.ListProjects(filter)
        return utils.SuccessMessage(
          title,
          'Projects retrieved successfully',
          projects
        )
      } catch (error) {
        utils.logger.warn(
          error as Error,
          'ProjectController.ListProjects Error'
        )
        set.status = 500
        return utils.ErrorMessage(title, 'Failed to retrieve projects')
      }
    },
    {
      query: t.Object({
        academicYear: t.Optional(t.Number()),
        semester: t.Optional(t.Number()),
        projectStatus: t.Optional(t.String()),
        projectName: t.Optional(t.String()),
        courseStatus: t.Optional(t.String()),
        projectSemester: t.Optional(t.Number()),
        projectAcademicYear: t.Optional(t.Number()),
      }),
      detail: {
        ...projectSwaggerDetail(
          'List projects',
          'Get a list of projects with optional filters'
        ),
        parameters: [
          {
            name: 'courseStatus, projectStatus',
            in: 'query',
            required: false,
            description:
              'Array of course status IDs. Use comma to separate multiple IDs (e.g., 1,2).',
          },
        ],
      },
    }
  )
  .get(
    '/:id',
    async ({ params, set }) => {
      try {
        const projectId = params.id
        const project = await projectUsecase.GetProjectById(projectId)
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
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      detail: projectSwaggerDetail('Get project', 'Get project by ID'),
    }
  )
  .patch(
    '/:id',
    async ({ params, body, set }) => {
      try {
        let req = body as UpdateProjectRequest
        req.id = params.id

        await projectUsecase.UpdateProject(req)
        return utils.SuccessMessage(title, 'Project updated successfully')
      } catch (error) {
        utils.logger.warn(
          error as Error,
          'ProjectController.UpdateProject Error'
        )
        set.status = 500
        return utils.ErrorMessage(title, 'Failed to update project')
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      body: t.Object({
        password: t.Optional(t.String()),
        projectName: t.Optional(t.String()),
        projectNameEng: t.Optional(t.String()),
        abstract: t.Optional(t.String()),
        abstractEng: t.Optional(t.String()),
        detail: t.Optional(t.String()),
        detailEng: t.Optional(t.String()),
        semester: t.Optional(t.Number()),
        academicYear: t.Optional(t.Number()),
        projectSemester: t.Optional(t.Number()),
        projectAcademicYear: t.Optional(t.Number()),
        type: t.Optional(t.Union([t.String(), t.Null()])),
        projectStatusId: t.Optional(t.Union([t.Number(), t.Null()])),
        courseStatus: t.Optional(t.Number()),
        examDateTime: t.Optional(t.Date()),
        examLocation: t.Optional(t.String()),
        students: t.Optional(
          t.Array(
            t.Object({
              studentId: t.String(),
              name: t.String(),
            })
          )
        ),
        users: t.Optional(
          t.Array(
            t.Object({
              userId: t.Number(),
              userProjectRole: t.Number(),
            })
          )
        ),
      }),
      detail: projectSwaggerDetail('Update project', 'Update a project by ID'),
    }
  )
  .patch(
    '/',
    async ({ body, set }) => {
      try {
        const req = body as UpdateProjectsRequest
        await projectUsecase.UpdateProjects(req)
        return utils.SuccessMessage(title, 'Projects updated successfully')
      } catch (error) {
        utils.logger.warn(
          error as Error,
          'ProjectController.UpdateProjects Error'
        )
        set.status = 500
        return utils.ErrorMessage(title, 'Failed to update projects')
      }
    },
    {
      body: t.Object({
        ids: t.Array(t.Number()),
        courseStatus: t.Optional(t.Number()),
        projectStatusId: t.Optional(t.Union([t.Number(), t.Null()])),
        semester: t.Optional(t.Number()),
        academicYear: t.Optional(t.Number()),
        projectSemester: t.Optional(t.Number()),
        projectAcademicYear: t.Optional(t.Number()),
        examDateTime: t.Optional(t.Union([t.Date(), t.Null()])),
        examLocation: t.Optional(t.Union([t.String(), t.Null()])),
        type: t.Optional(t.Union([t.String(), t.Null()])),
      }),
      detail: projectSwaggerDetail(
        'Update multiple projects',
        'Update multiple projects at once'
      ),
    }
  )
  .delete(
    '/:id',
    async ({ params, set }) => {
      try {
        const projectId = params.id
        const deletedProject = await projectUsecase.DeleteProject(projectId)
        if (!deletedProject) {
          set.status = 404
          return utils.NotFoundMessage(
            'Project not found',
            'The requested project does not exist'
          )
        }
        return utils.SuccessMessage(title, 'Project deleted successfully')
      } catch (error) {
        utils.logger.warn(
          error as Error,
          'ProjectController.DeleteProject Error'
        )
        set.status = 500
        return utils.ErrorMessage(title, 'Failed to delete project')
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      detail: projectSwaggerDetail('Delete a project', 'Delete a project'),
    }
  )
