import { CreateProjectDocument } from '@/models/ProjectDocument'
import course from '@/statics/constants/course/course'
import projectDocumentStatus from '@/statics/constants/projectDocumentStatus/projectDocumentStatus'
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
      orderBy: {
        createdAt: 'desc',
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

  static CreateProjectDocument = async (
    projectDocument: CreateProjectDocument
  ) => {
    return await prisma.$transaction(async (tx) => {
      const newProjectDocs = await tx.projectDocument.create({
        data: {
          projectId: projectDocument.projectId,
          documentId: projectDocument.documentId,
          documentName: projectDocument.documentName,
          documentUrl: projectDocument.documentUrl,
        },
      })

      if (projectDocument.commentIDs) {
        await tx.comment.updateMany({
          where: {
            id: {
              in: projectDocument.commentIDs,
            },
          },
          data: {
            projectDocumentEditId: newProjectDocs.id,
          },
        })
      }

      return newProjectDocs
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
  static ListLastDocsApproveInProject = async (projectId: number) => {
    const Docs = await prisma.projectDocument.findMany({
      where: {
        projectId,
        status: projectDocumentStatus.APPROVED,
      },
      include: {
        document: {
          select: {
            course: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      distinct: ['documentId'],
    })

    const preProjectDocs = []
    const projectDocs = []

    for (const doc of Docs) {
      if (doc.document.course === course.PreProject) {
        preProjectDocs.push(doc)
      } else if (doc.document.course === course.Project) {
        projectDocs.push(doc)
      }
    }

    return {
      preProject: preProjectDocs,
      project: projectDocs,
    }
  }

  static ListLastDocsStatusInProject = async (
    projectId: number,
    projectCourse: number
  ) => {
    const result = await prisma.projectDocument.findMany({
      where: {
        projectId: projectId,
        document: {
          course: projectCourse,
        },
      },
      distinct: ['documentId'],
      orderBy: [{ documentId: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        projectId: true,
        documentId: true,
        documentName: true,
        status: true,
      },
    })
    return result
  }
}
