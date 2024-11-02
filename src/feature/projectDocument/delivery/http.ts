import Elysia, { t } from 'elysia'
import bearer from '@elysiajs/bearer'
import { ProjectDocument } from '@prisma/client'
import { ProjectDocumentUsecase } from '../usercase/projectDocumentUsecase'
import { ProjectDocumentRequest } from '@/models/ProjectDocument'
import * as fs from 'fs/promises'
import * as middleWare from '@/middleware'
import * as utils from '@/utils'

const title = 'ProjectDocument Controller V1'
const projectDocumentUsecase = ProjectDocumentUsecase

const ProjectDocumentSwaggerDetail = (summary: string, detail: string) => {
  return {
    tags: ['ProjectDocument'],
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
  .post(
    '/',
    async ({ body, set }) => {
      let tempFilePath: string | null = null
      let url: string | null = null
      const gcs = utils.GCS()
      try {
        const req = body as ProjectDocumentRequest
        const data = JSON.parse(req.data) as ProjectDocument

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
        const url = await gcs.UploadFile(tempFilePath, destination)

        data.documentUrl = url
        await projectDocumentUsecase.CreateProjectDocument(data)

        await fs.rm('tmp', { recursive: true, force: true })

        return utils.SuccessMessage(title, 'Create project document success.')
      } catch (error) {
        await fs.rm('tmp', { recursive: true, force: true })

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
          description: 'JSON string containing project document metadata',
        }),
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
      const gcs = utils.GCS()
      try {
        const req = body as ProjectDocumentRequest
        const data = JSON.parse(req.data) as ProjectDocument

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

        const existingDoc = await projectDocumentUsecase.GetProjectDocument(
          params.id
        )
        if (!existingDoc) {
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

          if (existingDoc.documentUrl) {
            await gcs.DeleteFile(existingDoc.documentUrl)
          }
          data.documentUrl = url
        }

        data.id = params.id
        await projectDocumentUsecase.UpdateProjectDocument(data)

        if (req.document) await fs.rm('tmp', { recursive: true, force: true })

        return utils.SuccessMessage(title, 'Update project document success.')
      } catch (error) {
        await fs.rm('tmp', { recursive: true, force: true })

        if (url) await gcs.DeleteFile(url)

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
        document: t.Optional(t.File()),
        data: t.String(),
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
      const gcs = utils.GCS()
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
