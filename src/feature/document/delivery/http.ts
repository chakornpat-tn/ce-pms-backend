import Elysia, { t } from 'elysia'
import bearer from '@elysiajs/bearer'
import { DocumentUsecase } from '../usercase/documentUsecase'
import { Document } from '@prisma/client'
import * as middleWare from '@/middleware'
import * as utils from '@/utils'
import { ListDocumentRequest, UpdateDocumentRequest } from '@/models/Document'

const title = 'Document Controller V1'
const documentUsecase = DocumentUsecase

const DocumentSwaggerDetail = (summary: string, detail: string) => {
  return {
    tags: ['Document'],
    summary: summary,
    detail: detail,
  }
}

export const DocumentDelivery = new Elysia({ prefix: '/document' })
  .use(middleWare.JwtConfig)
  .use(bearer())
  .guard({
    beforeHandle: middleWare.checkAuthorization,
  })
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const req = body as Document
        await documentUsecase.CreateDocument(req)

        return utils.SuccessMessage(title, 'Create document successfully.')
      } catch (error) {
        utils.logger.warn(error, 'Create Document Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Create document error.')
      }
    },
    {
      body: t.Object({
        name: t.String(),
        course: t.Number(),
        submissionOpen: t.Optional(t.Boolean()),
        isActive: t.Optional(t.Boolean()),
      }),
      detail: DocumentSwaggerDetail('Create Document', 'Create a new document'),
      
    }
  )
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const course = query.course
          ? parseInt(query.course as string)
          : undefined
        const listRequest: ListDocumentRequest = {
          course: course,
          isActive: query.isActive
            ? (query.isActive as string) === 'true'
            : undefined,
          submissionOpen: query.submissionOpen
            ? (query.submissionOpen as string) === 'true'
            : undefined,
          search: query.search ? (query.search as string) : undefined,
        }

        const documents = await documentUsecase.ListDocument(listRequest)
        return utils.SuccessMessage(
          title,
          'list document successfully.',
          documents
        )
      } catch (error) {
        utils.logger.warn(error, 'List Document Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'list document error.')
      }
    },
    {
      query: t.Object({
        course: t.Optional(t.String()),
        isActive: t.Optional(t.String()),
        submissionOpen: t.Optional(t.String()),
        search: t.Optional(t.String()),
      }),
      detail: DocumentSwaggerDetail(
        'List Documents',
        'Get a list of all documents with optional filters'
      ),
      
    }
  )
  .put(
    '/',
    async ({ body, set }) => {
      try {
        const req = body as UpdateDocumentRequest[]
        if (!req[0].course) throw new Error('user bad request')

        await documentUsecase.UpdateDocument(req)

        return utils.SuccessMessage(title, 'update document successfully.')
      } catch (error) {
        utils.logger.warn(error, 'Update Document Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'update document error.')
      }
    },
    {
      body: t.Array(
        t.Object({
          id: t.Optional(t.Number()),
          name: t.String(),
          course: t.Number(),
          submissionOpen: t.Optional(t.Boolean()),
          isActive: t.Optional(t.Boolean()),
        })
      ),
      detail: DocumentSwaggerDetail(
        'Update Documents',
        'Update multiple documents with new information'
      ),
      
    }
  )

  .delete(
    '/:id',
    async ({ params, set }) => {
      try {
        const id = Number(params.id)
        await documentUsecase.DeleteDocument(id)

        return utils.SuccessMessage(title, 'delete document successfully.')
      } catch (error) {
        utils.logger.warn(error, 'Delete Document Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'delete document error.')
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      detail: DocumentSwaggerDetail(
        'Delete Document',
        'Delete a document by its ID'
      ),
      
    }
  )
