import { Document } from '@prisma/client'
import { DocumentRepository } from '../repository/documentRepository'
import { ListDocumentRequest, UpdateDocumentRequest } from '@/models/Document'

const documentRepo = DocumentRepository

export class DocumentUsecase {
  static CreateDocument = async (req: Document) => {
    return await documentRepo.CreateDocument(req)
  }

  static ListDocument = async (req: ListDocumentRequest) => {
    return await documentRepo.ListDocument(req)
  }

  static UpdateDocument = async (req: UpdateDocumentRequest[]) => {
    return await documentRepo.UpdateDocument(req)
  }

  static DeleteDocument = async (id: number) => {
    return await documentRepo.DeleteDocument(id)
  }
}