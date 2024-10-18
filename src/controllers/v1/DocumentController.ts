import { Request, Response } from 'express'
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
  const CreateDocument = async (req: Request, res: Response) => {
    try {
      const reqData: Document = req.body
      if (!reqData.course) throw new Error('course is required')
      await documentRepo.CreateDocument(reqData)

      res
        .status(200)
        .json(utils.SuccessMessage(title, 'create document successfully.'))
    } catch (error) {
      utils.logger.warn(error, 'Create Document Controller Error')
      res.status(500).json(utils.ErrorMessage(title, 'create document error.'))
    }
  }

  const ListDocument = async (req: Request, res: Response) => {
    try {
      const course = req.query.course
        ? parseInt(req.query.course as string)
        : undefined
      const listRequest: ListDocumentRequest = {
        course: course,
        isActive: req.query.isActive
          ? (req.query.isActive as string) === 'true'
          : undefined,
        submissionOpen: req.query.submissionOpen
          ? (req.query.submissionOpen as string) === 'true'
          : undefined,
        search: req.query.search ? (req.query.search as string) : undefined,
      }

      const documents = await documentRepo.ListDocument(listRequest)
      res
        .status(200)
        .json(
          utils.SuccessMessage(title, 'list document successfully.', documents)
        )
    } catch (error) {
      utils.logger.warn(error, 'List Document Controller Error')
      res.status(500).json(utils.ErrorMessage(title, 'list document error.'))
    }
  }

  const UpdateDocument = async (req: Request, res: Response) => {
    try {
      const reqData: UpdateDocumentRequest[] = req.body
      if (!reqData[0].course) throw new Error('user bad request')

      await documentRepo.UpdateDocument(reqData)

      res
        .status(200)
        .json(utils.SuccessMessage(title, 'update document successfully.'))
    } catch (error) {
      utils.logger.warn(error, 'Update Document Controller Error')
      res.status(500).json(utils.ErrorMessage(title, 'update document error.'))
    }
  }

  const DeleteDocument = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (!id) throw new Error('user bad request')

      await documentRepo.DeleteDocument(id)

      res
        .status(200)
        .json(utils.SuccessMessage(title, 'delete document successfully.'))
    } catch (error) {
      utils.logger.warn(error, 'Delete Document Controller Error')
      res.status(500).json(utils.ErrorMessage(title, 'delete document error.'))
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
