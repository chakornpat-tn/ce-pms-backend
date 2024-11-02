import { ListDocumentRequest, UpdateDocumentRequest } from '@/models/Document'
import { PrismaClient, Document } from '@prisma/client'

const prisma = new PrismaClient()

export class DocumentRepository {
  static ListDocument = async (req: ListDocumentRequest) => {
    return await prisma.document.findMany({
      where: {
        AND: [
          {
            course: req.course ? req.course : undefined,
          },
          {
            isActive: req.isActive !== undefined ? req.isActive : undefined,
          },
          {
            submissionOpen:
              req.submissionOpen !== undefined ? req.submissionOpen : undefined,
          },
          {
            OR: [
              req.search
                ? {
                    name: {
                      contains: req.search,
                      mode: 'insensitive',
                    },
                  }
                : {},
            ],
          },
        ],
      },
    })
  }
  static UpdateDocument = async (documentData: UpdateDocumentRequest[]) => {
    const transactionResult = await prisma.$transaction(
      documentData.map((doc) =>
        prisma.document.upsert({
          where: { id: doc.id || 0 },
          update: {
            name: doc.name,
            course: doc.course,
            isActive: doc.isActive,
            submissionOpen: doc.submissionOpen,
          },
          create: {
            name: doc.name,
            course: doc.course,
            isActive: doc.isActive,
            submissionOpen: doc.submissionOpen,
          },
        })
      )
    )

    return transactionResult
  }

  static CreateDocument = async (documentData: Document) => {
    const newDocument = await prisma.document.create({
      data: {
        name: documentData.name,
        course: documentData.course,
        isActive: documentData.isActive,
        submissionOpen: documentData.submissionOpen,
      },
    })

    return newDocument
  }

  static DeleteDocument = async (id: number) => {
    const deletedDocument = await prisma.document.delete({
      where: {
        id: id,
      },
    })

    return deletedDocument
  }
}
