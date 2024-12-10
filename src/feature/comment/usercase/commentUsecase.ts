import { UpdateCommentsRequest } from '@/models/Comment'
import { CommentRepository } from '../repository/commentRepository'
import { Comment } from '@prisma/client'

const commentRepo = CommentRepository

export class CommentUsecase {
  static CreateComment = (req: Comment[]) => {
    return commentRepo.CreateComment(req)
  }

  static GetCommentByID = (id: number) => {
    return commentRepo.GetCommentByID(id)
  }
  static ListComment = (
    projectDocumentId?: number,
    projectDocumentEditId?: number
  ) => {
    return commentRepo.ListComment(projectDocumentId, projectDocumentEditId)
  }

  static UpdateComments = (req: UpdateCommentsRequest) => {
    return commentRepo.UpdateComments(req)
  }

  static DeleteComment = (id: number) => {
    return commentRepo.DeleteComment(id)
  }

  static GetCommentsByProjectAndDocument = (
    projectId: number,
    documentId: number
  ) => {
    return commentRepo.GetCommentsByProjectAndDocument(projectId, documentId)
  }
}
