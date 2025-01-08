import Elysia, { t } from 'elysia'
import bearer from '@elysiajs/bearer'
import { ProjectDocument } from '@prisma/client'
import { ProjectDocumentUsecase } from '../usercase/projectDocumentUsecase'
import {
  CreateProjectDocument,
  ProjectDocumentRequest,
} from '@/models/ProjectDocument'
import * as fs from 'fs/promises'
import * as middleWare from '@/middleware'
import * as utils from '@/utils'

const title = 'ProjectDocument Controller V1'
const projectDocumentUsecase = ProjectDocumentUsecase

const ProjectDocumentSwaggerDetail = (summary: string, detail: string) => {
  return {
    tags: ['Project Document'],
    summary: summary,
    detail: detail,
  }
}

export const ProjectDocumentDelivery = new Elysia({
  prefix: '/project-document',
})
  .use(middleWare.JwtConfig)
  .use(bearer())
  .guard({
    beforeHandle: middleWare.checkAuthorization,
  })
  .get(
    '/wait-update/:userId',
    async ({ params, set }) => {
      try {
        const userID = params.userId
        const document = await projectDocumentUsecase.ListProjectDocsWaitUpdate(
          userID
        )

        return utils.SuccessMessage(
          title,
          'List Project Document Waiting Update Success.',
          document
        )
      } catch (error) {
        utils.logger.warn(error, 'List Project Document Waiting Update Error.')
        set.status = 500
        return utils.ErrorMessage(
          title,
          'List Project Document Waiting Update Success.'
        )
      }
    },
    {
      params: t.Object({
        userId: t.Number(),
      }),
      detail: ProjectDocumentSwaggerDetail(
        'List Project Document Waiting Update Success.',
        'List project document waiting update error.'
      ),
    }
  )
  .get(
    '/project-docs-status/:projectId/:course',
    async ({ params, set }) => {
      try {
        const projectId = params.projectId
        const course = params.course
        const document =
          await projectDocumentUsecase.ListLastStatusDocsInProject(
            projectId,
            course
          )
        if (!document) {
          set.status = 404
          return utils.ErrorMessage(
            title,
            'List Last document status in project error.'
          )
        }
        return utils.SuccessMessage(
          title,
          'List last document status in project.',
          document
        )
      } catch (error) {
        utils.logger.warn(
          error,
          'List Last Status Document In Project Controller Error'
        )
        set.status = 500
        return utils.ErrorMessage(
          title,
          'List last document status in project error.'
        )
      }
    },
    {
      params: t.Object({
        projectId: t.Number(),
        course: t.Optional(t.Number()),
      }),
      detail: ProjectDocumentSwaggerDetail(
        'List Last Document Status In Project',
        'List last document status by project id and course'
      ),
    }
  )
  .get(
    '/advisor-approve/:projectId',
    async ({ params, set }) => {
      try {
        const document =
          await projectDocumentUsecase.ListLastDocsApproveInProject(
            params.projectId
          )
        if (!document) {
          set.status = 404
          return utils.ErrorMessage(
            title,
            'List project document advisor approve error.'
          )
        }
        return utils.SuccessMessage(
          title,
          'list project document advisor approve success.',
          document
        )
      } catch (error) {
        utils.logger.warn(error, 'Project Document Controller Error')
        set.status = 500
        return utils.ErrorMessage(
          title,
          'List project document advisor approve error.'
        )
      }
    },
    {
      params: t.Object({
        projectId: t.Number(),
      }),
      detail: ProjectDocumentSwaggerDetail(
        'List Project Document Approve',
        'List project document approve by project id'
      ),
    }
  )
  .post(
    '/',
    async ({ body, set }) => {
      let tempFilePath: string | null = null
      let url: string | null = null
      const gcs = utils.GCS
      try {
        const req = body as ProjectDocumentRequest
        const data = JSON.parse(req.data) as CreateProjectDocument
        if (req.commentIDs) {
          const commentIDs = req.commentIDs.split(',').map(Number)
          data.commentIDs = commentIDs
        }

        if (!req.document.type.includes('pdf')) {
          set.status = 400
          return utils.ErrorMessage(title, 'Only PDF files are allowed.')
        }

        if (req.document.size > 25 * 1024 * 1024) {
          set.status = 400
          return utils.ErrorMessage(title, 'File size must be less than 25MB.')
        }

        const timestamp = new Date()
          .toISOString()
          .replace(/[-:T]/g, '')
          .slice(0, 12)
        const destination = `${timestamp}-${data.documentName}.pdf`
        tempFilePath = `tmp/${destination}`
        await Bun.write(tempFilePath, req.document)
        url = await gcs.UploadFile(tempFilePath, destination)

        data.documentUrl = url
        await projectDocumentUsecase.CreateProjectDocument(data)

        if (tempFilePath) await fs.rm(tempFilePath)

        return utils.SuccessMessage(title, 'Create project document success.')
      } catch (error) {
        if (tempFilePath) await fs.rm(tempFilePath)

        if (url) await gcs.DeleteFile(url)

        utils.logger.warn(error, 'Create Project Document Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Create project document error.')
      }
    },
    {
      body: t.Object({
        document: t.File({
          type: ['application/pdf'],
          description: 'PDF file to upload (max 25MB)',
        }),
        data: t.String({
          description:
            'JSON string containing project document {projectId: number, documentIdn: number, documentName: string } ',
        }),
        commentIDs: t.Optional(
          t.String({
            description: 'Comment IDs have edit in docs',
          })
        ),
      }),
      detail: ProjectDocumentSwaggerDetail(
        'Create Project Document',
        'Upload a new PDF document (max 25MB) and create a project document record with associated metadata'
      ),
    }
  )
  .get(
    '/:id',
    async ({ params, set }) => {
      try {
        const document = await projectDocumentUsecase.GetProjectDocument(
          params.id
        )
        if (!document) {
          set.status = 404
          return utils.ErrorMessage(title, 'project document not found.')
        }
        return utils.SuccessMessage(
          title,
          'get project document success.',
          document
        )
      } catch (error) {
        utils.logger.warn(error, 'Get Project Document Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Get project document error.')
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      detail: ProjectDocumentSwaggerDetail(
        'Get Project Document',
        'Get project document by ID'
      ),
    }
  )
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const req = {
          projectId: query.projectId,
          documentId: query.documentId,
        }
        const documents = await projectDocumentUsecase.ListProjectDocument(
          req.projectId,
          req.documentId
        )
        return utils.SuccessMessage(
          title,
          'list project documents success.',
          documents
        )
      } catch (error) {
        utils.logger.warn(error, 'List Project Documents Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'List project documents error.')
      }
    },
    {
      query: t.Object({
        projectId: t.Number(),
        documentId: t.Number(),
      }),
      detail: ProjectDocumentSwaggerDetail(
        'List Project Documents',
        'List project documents by project ID and document ID'
      ),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      let tempFilePath: string | null = null
      let url: string | null = null
      let tempFilePath2: string | null = null
      let url2: string | null = null
      const gcs = utils.GCS
      try {
        const req = body as ProjectDocumentRequest
        const data = req.data ? JSON.parse(req.data) as ProjectDocument : {} as ProjectDocument

        if (req.document) {
          if (!req.document.type.includes('pdf')) {
            set.status = 400
            return utils.ErrorMessage(title, 'Only PDF files are allowed.')
          }

          if (req.document.size > 25 * 1024 * 1024 && req.document) {
            set.status = 400
            return utils.ErrorMessage(
              title,
              'File size must be less than 25MB.'
            )
          }
        }

        const existingDocs = await projectDocumentUsecase.GetProjectDocument(
          params.id
        )
        if (!existingDocs) {
          set.status = 404
          return utils.ErrorMessage(title, 'Project document not found.')
        }

        if (req.document) {
          const timestamp = new Date()
            .toISOString()
            .replace(/[-:T]/g, '')
            .slice(0, 12)
          const destination = `${timestamp}.pdf`
          tempFilePath = `tmp/${destination}`
          await Bun.write(tempFilePath, req.document)
          url = await gcs.UploadFile(tempFilePath, destination)

          try {
            if (existingDocs.documentUrl)
              await gcs.DeleteFile(existingDocs.documentUrl)
          } catch (error) {
            console.log('Error deleting file:', error)
          }

          data.documentUrl = url
        }

        if (req.advisorDocs) {
          const timestamp = new Date()
            .toISOString()
            .replace(/[-:T]/g, '')
            .slice(0, 12)
          const destination = `${timestamp}-${params.id}-advisor-report.pdf`
          tempFilePath2 = `tmp/${destination}`
          await Bun.write(tempFilePath2, req.advisorDocs)
          url2 = await gcs.UploadFile(tempFilePath2, destination)

          try {
            if (existingDocs.advisorDocsUrl)
              await gcs.DeleteFile(existingDocs.advisorDocsUrl)
          } catch (error) {
            console.log('Error deleting file:', error)
          }

          data.advisorDocsUrl = url2
        }

        data.id = params.id
        
        await projectDocumentUsecase.UpdateProjectDocument(data)

        if (tempFilePath) await fs.rm(tempFilePath)
        if (tempFilePath2) await fs.rm(tempFilePath2)

        return utils.SuccessMessage(title, 'Update project document success.')
      } catch (error) {
        if (tempFilePath) await fs.rm(tempFilePath)
        if (tempFilePath2) await fs.rm(tempFilePath2)

        if (url) await gcs.DeleteFile(url)
        if (url2) await gcs.DeleteFile(url2)

        utils.logger.warn(error, 'Update Project Document Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Update project document error.')
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      body: t.Object({
        document: t.Optional(
          t.File({
            type: ['application/pdf'],
            description: 'Project Exam PDF file to upload (max 25MB)',
          })
        ),
        advisorDocs: t.Optional(
          t.File({
            type: ['application/pdf'],
            description: 'Advisor Exam PDF file to upload (max 25MB)',
          })
        ),
        data: t.Optional(
          t.String({
            description:
              '{ documentName: string, documentUrl: string, status: number }',
          })
        ),
      }),
      detail: ProjectDocumentSwaggerDetail(
        'Update Project Document',
        'Update project document by ID with optional file upload'
      ),
    }
  )
  .delete(
    '/:id',
    async ({ params, set }) => {
      const gcs = utils.GCS
      try {
        const document = await projectDocumentUsecase.GetProjectDocument(
          params.id
        )
        if (!document) {
          set.status = 404
          return utils.ErrorMessage(title, 'project document not found.')
        }

        if (document.documentUrl) {
          await gcs.DeleteFile(document.documentUrl)
        }

        await projectDocumentUsecase.DeleteProjectDocument(params.id)
        return utils.SuccessMessage(title, 'delete project document success.')
      } catch (error) {
        utils.logger.warn(error, 'Delete Project Document Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'delete project document error.')
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      detail: ProjectDocumentSwaggerDetail(
        'Delete Project Document',
        'Delete project document by ID'
      ),
    }
  )
