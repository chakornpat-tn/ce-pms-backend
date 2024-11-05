import { ProjectUser, PrismaClient } from '@prisma/client'
import { ListProjectsFilter } from '@/models/Project'
import { UpdateProjectUserRequest } from '@/models/ProjectUser'

const prisma = new PrismaClient()

export class ProjectUserRepository {
  static CreateProjectUSer = async (projectUser: ProjectUser) => {
    return prisma.projectUser.create({
      data: projectUser,
    })
  }

  static UpdateProjectUser = async (projectUser: UpdateProjectUserRequest) => {
    if (!projectUser.projectId) throw new Error('ProjectId is required')
    return prisma.projectUser.update({
      where: {
        projectId_userId: {
          projectId: projectUser.projectId,
          userId: projectUser.userId,
        },
      },
      data: projectUser,
    })
  }

  static DeleteProjectUser = async (projectId: number, userId: number) => {
    return prisma.projectUser.delete({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
    })
  }

  static ListProjectUser = async (userId: number, req: ListProjectsFilter) => {
    const projects = await prisma.project.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
        ...(req.academicYear !== undefined && {
          academicYear: req.academicYear,
        }),
        ...(req.semester !== undefined && { semester: req.semester }),
        ...(req.projectName && {
          projectName: {
            contains: req.projectName,
            mode: 'insensitive',
          },
        }),
        ...(req.projectStatus && {
          projectStatusId: {
            in: req.projectStatus,
          },
        }),
        ...(req.courseStatus && {
          courseStatus: {
            in: req.courseStatus,
          },
        }),
      },
      select: {
        id: true,
        projectName: true,
        projectNameEng: true,
        projectStatus: true,
        courseStatus: true,
        academicYear: true,
        semester: true,
        type: true,
        updatedAt: true,
        examDateTime: true,
      },
    })

    return projects
  }

  static GetProjectUSer = async (projectId: number, userId: number) => {
    return prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
    })
  }

  static GetProjectsWithIncompleteUsers = async (req: ListProjectsFilter) => {
    const projectUserCounts = await prisma.projectUser.groupBy({
      by: ['projectId'],
      where: {
        project: {
          academicYear: req.academicYear,
          ...(req.semester && { semester: req.semester }),
          ...(req.projectName && {
            projectName: {
              contains: req.projectName,
              mode: 'insensitive',
            },
          }),
          ...(req.courseStatus && {
            courseStatus: {
              in: req.courseStatus,
            },
          }),
        },
      },
      _count: {
        userId: true,
      },
    })

    const res = projectUserCounts.filter((item) => item._count.userId < 3)

    return res
  }
  static GetProjectByIDs = async (projectIds: number[]) => {
    return prisma.project.findMany({
      where: {
        id: {
          in: projectIds,
        },
      },
      select: {
        id: true,
        projectName: true,
        projectNameEng: true,
        abstract: true,
        abstractEng: true,
        users: {
          select: {
            user: {
              select: {
                name: true,
                role: true,
              },
            },
          },
        },
        students: {
          select: {
            student: {
              select: {
                id: true,
                studentId: true,
                name: true,
              },
            },
          },
        },
        projectStatus: true,
        courseStatus: true,
        academicYear: true,
        semester: true,
        type: true,
        updatedAt: true,
      },
    })
  }
}
