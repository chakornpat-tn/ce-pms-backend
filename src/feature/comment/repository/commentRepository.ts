import { UpdateCommentsRequest } from '@/models/Comment'
import { PrismaClient, Comment } from '@prisma/client'

const prisma = new PrismaClient()

export class CommentRepository {
  static async CreateComment(comment: Comment[]) {
    return prisma.comment.createMany({
      data: comment,
    })
  }

  static async GetCommentByID(id: number) {
    return prisma.comment.findUnique({
      where: {
        id,
      },
    })
  }
  static async ListComment(
    projectDocumentId?: number,
    projectDocumentEditId?: number
  ) {
    return prisma.comment.findMany({
      where: {
        projectDocumentId,
        projectDocumentEditId:
          projectDocumentEditId === undefined ? null : projectDocumentEditId,
      },
    })
  }

  static async UpdateComments(comment: UpdateCommentsRequest) {
    return prisma.comment.updateMany({
      where: {
        id: {
          in: comment.ids,
        },
      },
      data: {
        content: comment.content,
        projectDocumentEditId: comment.projectDocumentEditId,
      },
    })
  }

  static async DeleteComment(id: number) {
    return prisma.comment.delete({
      where: {
        id,
      },
    })
  }

  static async GetCommentsByProjectAndDocument(
    projectId: number,
    documentId: number,
  ) {
    const projectDocuments = await prisma.projectDocument.findMany({
      select: {
        id: true,
      },
      where: {
        projectId: projectId,
        documentId: documentId,
      },
    })

    return prisma.comment.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        projectDocumentEditId: null,
        projectDocumentId: {
          in: projectDocuments.map(doc => doc.id),
        },
      },
    })
  }}
