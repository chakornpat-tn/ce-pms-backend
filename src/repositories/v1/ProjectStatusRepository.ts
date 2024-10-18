import { PrismaClient, Project } from '@prisma/client'
import {
  ProjectStatus,
  UpdateProjectStatusRequest,
  ListProjectStatusRequest,
} from '@/models/ProjectStatus'

const prisma = new PrismaClient()

const useProjectStatusRepository = () => {
  const ListProjectStatus = async (req: ListProjectStatusRequest) => {
    return await prisma.projectStatus.findMany({
      where: {
        AND: [
          {
            course: req.course ? req.course : undefined,
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

  const UpdateProjectStatus = async (
    projectStatusData: UpdateProjectStatusRequest[]
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

  const CreateProjectStatus = async (projectStatusData: ProjectStatus) => {
    const newProjectStatus = await prisma.projectStatus.create({
      data: {
        name: projectStatusData.name,
        course: projectStatusData.course,
        textColor: projectStatusData.textColor,
        bgColor: projectStatusData.bgColor,
        isActive: projectStatusData.isActive,
      },
    })

    return newProjectStatus
  }

  const DeleteProjectStatus = async (id: number) => {
    const deletedProjectStatus = await prisma.projectStatus.delete({
      where: {
        id: id,
      },
    })

    return deletedProjectStatus
  }

  return {
    CreateProjectStatus,
    ListProjectStatus,
    UpdateProjectStatus,
    DeleteProjectStatus,
  }
}

export default useProjectStatusRepository
