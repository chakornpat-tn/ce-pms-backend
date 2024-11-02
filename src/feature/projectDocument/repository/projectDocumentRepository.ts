import { PrismaClient, ProjectDocument } from '@prisma/client'

const prisma = new PrismaClient()
const commentSelect = {
  id: true,
  content: true,
  projectDocumentId: true,
}

export class ProjectDocumentRepository {
  static ListProjectDocument = async (
    projectId: number,
    documentId: number
  ) => {
    return await prisma.projectDocument.findMany({
      where: {
        AND: [
          {
            projectId: projectId,
          },
          {
            documentId: documentId,
          },
        ],
      },
      include: {
        comments: {
          select: commentSelect,
        },
        CommentBasedEdits: {
          select: commentSelect,
        },
      },
    })
  }

  static GetProjectDocumentByID = async (id: number) => {
    return await prisma.projectDocument.findUnique({
      where: {
        id: id,
      },
      include: {
        comments: {
          select: commentSelect,
        },
        CommentBasedEdits: {
          select: commentSelect,
        },
      },
    })
  }

  static CreateProjectDocument = async (projectDocument: ProjectDocument) => {
    return await prisma.projectDocument.create({
      data: {
        projectId: projectDocument.projectId,
        documentId: projectDocument.documentId,
        documentName: projectDocument.documentName,
        documentUrl: projectDocument.documentUrl,
      },
    })
  }

  static UpdateProjectDocument = async (projectDocument: ProjectDocument) => {
    const record = await prisma.projectDocument.findFirst({
      where: {
        id: projectDocument.id,
      },
    })

    if (!record) {
      throw new Error('Project document not found')
    }

    return await prisma.projectDocument.update({
      where: {
        id: record.id,
      },
      data: {
        documentName: projectDocument.documentName,
        documentUrl: projectDocument.documentUrl,
        status: projectDocument.status,
      },
    })
  }

  static DeleteProjectDocument = async (id: number) => {
    return await prisma.projectDocument.delete({
      where: {
        id,
      },
    })
  }
}
