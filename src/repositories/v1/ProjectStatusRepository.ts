import { PrismaClient } from '@prisma/client'
import {
  CreateOrUpdateProjectStatusRequest,
  ListProjectStatusRequest,
} from '@/models/ProjectStatus'

const prisma = new PrismaClient()

const useProjectStatusRepository = () => {
  const ListProjectStatus = async (req: ListProjectStatusRequest) => {
    return await prisma.projectStatus.findMany({
      where: {
        AND: [
          {
            course: req.course,
          },
          {
            isActive: req.isActive !== undefined ? req.isActive : undefined,
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
      select: {
        id: true,
        name: true,
        textColor: true,
        bgColor: true,
        isActive: true,
      },
    })
  }

  const CreateOrUpdateProjectStatus = async (
    projectStatusData: CreateOrUpdateProjectStatusRequest[]
  ) => {
    const projectStatusIDs = projectStatusData
      .filter((status) => status.id && status.id > 0)
      .map((status) => status.id!)

    const transactionResult = await prisma.$transaction(async (tx) => {
      if (projectStatusIDs.length > 0) {
        await tx.projectStatus.deleteMany({
          where: {
            AND: [
              {
                id: { notIn: projectStatusIDs },
              },
              {
                course: projectStatusData[0].course,
              },
            ],
          },
        })
      }

      await Promise.all(
        projectStatusData.map((status) =>
          tx.projectStatus.upsert({
            where: { id: status.id || 0 },
            update: {
              name: status.name,
              course: status.course,
              textColor: status.textColor,
              bgColor: status.bgColor,
              isActive: status.isActive,
            },
            create: {
              name: status.name,
              course: status.course,
              textColor: status.textColor,
              bgColor: status.bgColor,
              isActive: status.isActive,
            },
          })
        )
      )
    })

    return transactionResult
  }
  return {
    ListProjectStatus,
    CreateOrUpdateProjectStatus,
  }
}

export default useProjectStatusRepository
