import Elysia, { t } from 'elysia'
import bearer from '@elysiajs/bearer'
import { ProjectUserUsecase } from '../usercase/projectUserUsecase'
import * as fs from 'fs/promises'
import * as middleWare from '@/middleware'
import * as utils from '@/utils'
import {
  ProjectUserUploadRequest,
  UpdateProjectUserRequest,
} from '@/models/ProjectUser'
import { ListProjectsFilter, UpdateProjectRequest } from '@/models/Project'
import { ProjectUser } from '@prisma/client'

const title = 'Project User Controller V1'
const projectUserUsecase = ProjectUserUsecase
const ProjectUserSwaggerDetail = (summary: string, detail: string) => {
  return {
    tags: ['Project User'],
    summary: summary,
    detail: detail,
  }
}

export const ProjectUserDelivery = new Elysia({ prefix: '/project-user' })
  .use(bearer())
  .use(middleWare.JwtConfig)
  .guard({
    beforeHandle: middleWare.checkAuthorization,
  })
  .get(
    '/check-advisor/:userId/:projectId',
    async ({ params, set }) => {
      try {
        const projectId = params.projectId
        const userId = params.userId
        const isAdvisor = await projectUserUsecase.CheckUserIsAdvisor(
          userId,
          projectId
        )
        set.status = 200
        return utils.SuccessMessage(
          title,
          'Check Advisor Project Success.',
          isAdvisor
        )
      } catch (error) {
        utils.logger.warn(error, 'Check Advisor Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Check Advisor Error.')
      }
    },
    {
      params: t.Object({
        userId: t.Number(),
        projectId: t.Number(),
      }),
      detail: ProjectUserSwaggerDetail(
        'Check Advisor',
        'Check Advisor Project'
      ),
    }
  )
  .get(
    '/check-regis-exam-date/:projectId',
    async ({ params, set }) => {
      try {
        const projectId = params.projectId

        const res = await projectUserUsecase.CheckStatusRegisExamDateTime(
          projectId
        )

        set.status = 200
        return utils.SuccessMessage(
          title,
          'Get Status Regis Exam Date Time Success.',
          res
        )
      } catch (error) {
        utils.logger.warn(error, 'Get Status Regis Exam Date Time Error.')
        set.status = 500
        return utils.ErrorMessage(
          title,
          'Get Status Regis Exam Date Time Error.'
        )
      }
    },
    {
      params: t.Object({
        projectId: t.Number(),
      }),
      detail: ProjectUserSwaggerDetail(
        'Get Status Regis Exam Date Time',
        'Get Status Regis Exam Date Time'
      ),
    }
  )
  .get(
    '/committee/:userId',
    async ({ params, set, query }) => {
      try {
        const userId = params.userId
        const req: ListProjectsFilter = {
          academicYear: query.academicYear,
          semester: query.semester,
          projectStatus: query.projectStatus
            ? query.projectStatus.split(',').map(Number)
            : undefined,
          projectName: query.projectName || undefined,
          courseStatus: query.courseStatus
            ? query.courseStatus.split(',').map(Number)
            : undefined,
        }

        const projects = await projectUserUsecase.GetProjectInCommitteeByUserID(
          userId,
          req
        )

        set.status = 200
        return utils.SuccessMessage(
          title,
          'Get project in committee success.',
          projects
        )
      } catch (error) {
        utils.logger.warn(
          error,
          'Get Project In Committee By User ID Controller Error'
        )
        set.status = 500
        return utils.ErrorMessage(
          title,
          'Get Project In Committee By User ID Error.'
        )
      }
    },
    {
      params: t.Object({
        userId: t.Number(),
      }),
      query: t.Object({
        academicYear: t.Optional(t.Number()),
        semester: t.Optional(t.Number()),
        projectName: t.Optional(t.String()),
        projectStatus: t.Optional(
          t.String({
            detail:
              'Array of project status IDs. Use comma to separate multiple IDs (e.g., 1,2).',
          })
        ),
        courseStatus: t.Optional(
          t.String({
            detail:
              'Array of course status IDs. Use comma to separate multiple IDs (e.g., 1,2).',
          })
        ),
      }),
      detail: ProjectUserSwaggerDetail(
        'Get Project In Committee By User ID',
        'Get project in committee by user ID'
      ),
    }
  )
  .get(
    '/in-complete-users/:userId',
    async ({ set, query, params }) => {
      try {
        const filter: ListProjectsFilter = {
          academicYear: query.academicYear,
          semester: query.semester,
          projectName: query.projectName || undefined,
          courseStatus: query.courseStatus
            ? query.courseStatus.split(',').map(Number)
            : undefined,
        }

        const projects =
          await projectUserUsecase.GetProjectsWithIncompleteUsers(
            filter,
            params.userId
          )

        set.status = 200
        return utils.SuccessMessage(
          title,
          'Get project with incomplete users success.',
          projects
        )
      } catch (error) {
        utils.logger.warn(error, 'List In Complete Users Controller Error')
        set.status = 500
        return utils.ErrorMessage(
          title,
          'List In Complete Users Controller Error'
        )
      }
    },
    {
      params: t.Object({
        userId: t.Number(),
      }),
      query: t.Object({
        academicYear: t.Number(),
        semester: t.Optional(t.Number()),
        projectName: t.Optional(t.String()),
        courseStatus: t.Optional(t.String()),
      }),
      detail: ProjectUserSwaggerDetail(
        'List In Complete Users',
        'List project with incomplete users'
      ),
    }
  )
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const req = body as ProjectUser
        await projectUserUsecase.CreateProjectUser(req)

        set.status = 200
        return utils.SuccessMessage(title, 'Create project user success.')
      } catch (error) {
        utils.logger.warn(error, 'Create Project User Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Create project user error.')
      }
    },
    {
      body: t.Object({
        projectId: t.Number(),
        userId: t.Number(),
        userProjectRole: t.Number(),
      }),
      detail: ProjectUserSwaggerDetail(
        'Create Project User',
        'Create project user by ID'
      ),
    }
  )
  .delete(
    '/:userId/:projectId',
    async ({ params, set }) => {
      try {
        const projectId = params.projectId
        const userId = params.userId
        const project = await projectUserUsecase.DeleteProjectUser(
          projectId,
          userId
        )

        if (project.prepDocs || project.projectDocs) {
          const gcs = utils.GCS
          if (project.prepDocs) gcs.DeleteFile(project.prepDocs)
          if (project.projectDocs) gcs.DeleteFile(project.projectDocs)
        }

        set.status = 200
        return utils.SuccessMessage(title, 'Delete project user success.')
      } catch (error) {
        utils.logger.warn(error, 'Delete Project User Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Delete project user error.')
      }
    },
    {
      params: t.Object({
        projectId: t.Number(),
        userId: t.Number(),
      }),
      detail: ProjectUserSwaggerDetail(
        'Delete Project User',
        'Delete project user by ID'
      ),
    }
  )
  .put(
    '/',
    async ({ body, set }) => {
      let tempFilePath: string | null = null
      let url: string | null = null
      const gcs = utils.GCS

      try {
        const req = body as ProjectUserUploadRequest
        const data = JSON.parse(req.data) as UpdateProjectUserRequest

        if (!data.userId && !data.projectId) {
          set.status = 400
          return utils.ErrorMessage(title, 'Missing required fields.')
        }

        if (req.prepDocs && req.projectDocs) {
          set.status = 400
          return utils.ErrorMessage(title, 'Only one file is allowed.')
        }

        const existingDocs = await projectUserUsecase.GetProjectUser(
          data.projectId,
          data.userId
        )
        if (!existingDocs) {
          set.status = 400
          return utils.ErrorMessage(title, 'Project user not found.')
        }

        if (req.prepDocs || req.projectDocs) {
          const file = req.projectDocs || req.prepDocs
          if (!file) {
            set.status = 400
            return utils.ErrorMessage(title, 'No file provided.')
          }

          if (!file.type.includes('pdf')) {
            set.status = 400
            return utils.ErrorMessage(title, 'Only PDF files are allowed.')
          }

          if (file.size > 25 * 1024 * 1024) {
            set.status = 400
            return utils.ErrorMessage(
              title,
              'File size must be less than 25MB.'
            )
          }

          const timestamp = new Date()
            .toISOString()
            .replace(/[-:T]/g, '')
            .slice(0, 12)

          let examType = ''
          if (req.prepDocs) examType = 'prep'
          else if (req.projectDocs) examType = 'project'

          const destination = `${timestamp}-${examType}-${data.projectId}&${data.userId}.pdf`
          tempFilePath = `tmp/${destination}`
          await Bun.write(tempFilePath, file)
          url = await gcs.UploadFile(tempFilePath, destination, 'exam-docs')

          if (req.prepDocs) {
            data.prepDocs = url
          } else if (req.projectDocs) {
            data.projectDocs = url
          }
        }

        await projectUserUsecase.UpdateProjectUser(data)

        // if (req.prepDocs && existingDocs.prepDocs)
        //   await gcs.DeleteFile(existingDocs.prepDocs)
        // else if (req.projectDocs && existingDocs.projectDocs)
        //   await gcs.DeleteFile(existingDocs.projectDocs)

        if (tempFilePath) await fs.rm(tempFilePath)

        set.status = 200
        return utils.SuccessMessage(title, 'Update project user success.')
      } catch (error) {
        if (tempFilePath) await fs.rm(tempFilePath)
        if (url) await gcs.DeleteFile(url)

        utils.logger.warn(error, 'Update Project User Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Update project user error.')
      }
    },
    {
      body: t.Object({
        projectDocs: t.Optional(
          t.File({
            type: ['application/pdf'],
            description: 'Project Exam PDF file to upload (max 25MB)',
          })
        ),
        prepDocs: t.Optional(
          t.File({
            type: ['application/pdf'],
            description: 'PreProject Exam PDF file to upload (max 25MB)',
          })
        ),
        data: t.String({
          description:
            'JSON string containing project user metadata { userId: number, projectId: number, userProjectRole: number }',
        }),
      }),
      detail: ProjectUserSwaggerDetail(
        'Update Project User',
        'Update project user or upload file exam by userId and projectId'
      ),
    }
  )
  .get(
    '/:userId',
    async ({ params, set, query }) => {
      try {
        const userId = params.userId
        const req: ListProjectsFilter = {
          academicYear: query.academicYear,
          semester: query.semester,
          projectAcademicYear: query.projectAcademicYear,
          projectSemester: query.projectSemester,
          projectStatus: query.projectStatus
            ? query.projectStatus.split(',').map(Number)
            : undefined,
          projectName: query.projectName || undefined,
          courseStatus: query.courseStatus
            ? query.courseStatus.split(',').map(Number)
            : undefined,
        }

        const projects = await projectUserUsecase.ListProjectUser(userId, req)

        set.status = 200
        return utils.SuccessMessage(
          title,
          'Get project user success.',
          projects
        )
      } catch (error) {
        utils.logger.warn(error, 'List Project User Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'List project user error.')
      }
    },
    {
      params: t.Object({
        userId: t.Number(),
      }),
      query: t.Object({
        academicYear: t.Optional(t.Number()),
        semester: t.Optional(t.Number()),
        projectAcademicYear: t.Optional(t.Number()),
        projectSemester: t.Optional(t.Number()),
        projectName: t.Optional(t.String()),
        projectStatus: t.Optional(
          t.String({
            detail:
              'Array of project status IDs. Use comma to separate multiple IDs (e.g., 1,2).',
          })
        ),
        courseStatus: t.Optional(
          t.String({
            detail:
              'Array of course status IDs. Use comma to separate multiple IDs (e.g., 1,2).',
          })
        ),
      }),
      detail: ProjectUserSwaggerDetail(
        'List Project User',
        'List project user by userId'
      ),
    }
  )
  .get(
    '/detail',
    async ({ set, query }) => {
      try {
        const userId = query.userId
        const projectId = query.projectId
        const projectUser = await projectUserUsecase.GetProjectUserDetail(
          projectId,
          userId
        )
        set.status = 200
        return utils.SuccessMessage(
          title,
          'get project user detail success.',
          projectUser
        )
      } catch (error) {
        utils.logger.warn(error, 'Get Project User Detail Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Get project user detail error.')
      }
    },
    {
      query: t.Object({
        userId: t.Optional(t.Number()),
        projectId: t.Optional(t.Number()),
      }),
      detail: ProjectUserSwaggerDetail(
        'Get Project User Detail',
        'Get project user detail by userId and projectId'
      ),
    }
  )
