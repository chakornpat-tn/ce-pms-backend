import { Context } from 'elysia'
import * as utils from '@/utils'
import {
  Document,
  UpdateDocumentRequest,
  ListDocumentRequest,
} from '@/models/Document'
import useDocumentRepository from '@/repositories/v1/DocumentRepository'

const title = 'Document Controller V1'
const documentRepo = useDocumentRepository()

const useDocumentController = () => {
  const CreateDocument = async ({ body, set }: Context) => {
    try {
      const req = body as  Document
      if (!req.course) throw new Error('course is required')
      await documentRepo.CreateDocument(req)

      return utils.SuccessMessage(title, 'create document successfully.')
    } catch (error) {
      utils.logger.warn(error, 'Create Document Controller Error')
      set.status = 500
      return utils.ErrorMessage(title, 'create document error.')
    }
  }

  const ListDocument = async ({ query, set }: Context) => {
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

      const documents = await documentRepo.ListDocument(listRequest)
      return utils.SuccessMessage(title, 'list document successfully.', documents)
    } catch (error) {
      utils.logger.warn(error, 'List Document Controller Error')
      set.status = 500
      return utils.ErrorMessage(title, 'list document error.')
    }
  }

  const UpdateDocument = async ({ body, set }: Context) => {
    try {
      const req = body as UpdateDocumentRequest[]
      if (!req[0].course) throw new Error('user bad request')

      await documentRepo.UpdateDocument(req)

      return utils.SuccessMessage(title, 'update document successfully.')
    } catch (error) {
      utils.logger.warn(error, 'Update Document Controller Error')
      set.status = 500
      return utils.ErrorMessage(title, 'update document error.')
    }
  }

  const DeleteDocument = async ({ params, set }: Context) => {
    try {
      const id = Number(params.id)
      if (!id) throw new Error('user bad request')

      await documentRepo.DeleteDocument(id)

      return utils.SuccessMessage(title, 'delete document successfully.')
    } catch (error) {
      utils.logger.warn(error, 'Delete Document Controller Error')
      set.status = 500
      return utils.ErrorMessage(title, 'delete document error.')
    }
  }
  return {
    CreateDocument,
    ListDocument,
    UpdateDocument,
    DeleteDocument,
  }
}

export default useDocumentController