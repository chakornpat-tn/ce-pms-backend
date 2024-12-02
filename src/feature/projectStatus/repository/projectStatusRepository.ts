import { PrismaClient, Project } from '@prisma/client'
import {
  ProjectStatus,
  UpdateProjectStatusRequest,
  ListProjectStatusRequest,
} from '@/models/ProjectStatus'

const prisma = new PrismaClient()

export class ProjectStatusRepository {
  static ListProjectStatus = async (req: ListProjectStatusRequest) => {
    return await prisma.projectStatus.findMany({
      where: {
        AND: [
          {
            course: req.course !== undefined ? req.course : undefined,
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
        course:true
      },
    })
  }

  static UpdateProjectStatus = async (
    projectStatusData: UpdateProjectStatusRequest[]
  ) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
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

  static CreateProjectStatus = async (projectStatusData: ProjectStatus) => {
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

  static DeleteProjectStatus = async (id: number) => {
    const deletedProjectStatus = await prisma.projectStatus.delete({
      where: {
        id: id,
      },
    })

    return deletedProjectStatus
  }
}
