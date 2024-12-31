import { ProjectUser, PrismaClient } from '@prisma/client'
import { ListProjectsFilter } from '@/models/Project'
import { UpdateProjectUserRequest } from '@/models/ProjectUser'
import courseStatus from '@/statics/constants/course/courseStatus'
import userProjectRole from '@/statics/constants/userProjectRole/userProjectRole'

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
            userProjectRole: {
              not: userProjectRole.COMMITTEE,
            },
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
        ...(req.projectSemester && {
          projectSemester: req.projectSemester,
        }),
        ...(req.projectAcademicYear && {
          projectAcademicYear: req.projectAcademicYear,
        }),
      },
      select: {
        id: true,
        username: true,
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
          ...(req.academicYear && { academicYear: req.academicYear }),
          ...(req.projectAcademicYear && {
            projectAcademicYear: req.projectAcademicYear,
          }),
          ...(req.semester && { semester: req.semester }),
          ...(req.projectSemester && { projectSemester: req.projectSemester }),
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
  static GetProjectByIDs = async (projectIds: number[], userId: number) => {
    return prisma.project.findMany({
      where: {
        AND: [
          {
            id: {
              in: projectIds,
            },
          },
          {
            users: {
              none: {
                userId: userId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        projectName: true,
        projectNameEng: true,
        abstract: true,
        abstractEng: true,
        users: {
          select: {
            userId: true,
            userProjectRole: true,
            user: {
              select: {
                name: true,
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

  static GetProjectInCommitteeByUserID = async (
    userID: number,
    filter: ListProjectsFilter
  ) => {
    const projectIDsInCommittee = await prisma.projectUser.findMany({
      where: {
        userId: userID,
        userProjectRole: userProjectRole.COMMITTEE,
      },
      select: {
        projectId: true,
      },
    })

    const {
      academicYear,
      semester,
      projectName,
      projectStatus,
      courseStatus,
      projectAcademicYear,
      projectSemester,
    } = filter

    const projects = await prisma.project.findMany({
      where: {
        AND: [
          {
            id: {
              in: projectIDsInCommittee.map((item) => item.projectId),
            },
          },
          ...(academicYear ? [{ academicYear }] : []),
          ...(semester ? [{ semester }] : []),
          ...(projectName
            ? [
                {
                  projectName: {
                    contains: projectName,
                    mode: 'insensitive' as const,
                  },
                },
              ]
            : []),
          ...(projectStatus
            ? [
                {
                  projectStatusId: {
                    in: projectStatus,
                  },
                },
              ]
            : []),
          ...(courseStatus
            ? [
                {
                  courseStatus: {
                    in: courseStatus,
                  },
                },
              ]
            : []),
          ...(projectSemester ? [{ projectSemester: projectSemester }] : []),
          ...(projectAcademicYear
            ? [{ projectAcademicYear: projectAcademicYear }]
            : []),
        ],
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        username: true,
        projectName: true,
        abstract: true,
        semester: true,
        academicYear: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        projectStatus: {
          select: {
            id: true,
            name: true,
            textColor: true,
            bgColor: true,
          },
        },
        courseStatus: true,
      },
    })
    return projects
  }

  static CheckStatusRegisExamDateTime = async (projectID: number) => {
    const projectExists = await prisma.project.findFirst({
      where: {
        id: projectID,
        OR: [
          { courseStatus: courseStatus.ApprovePreExam },
          { courseStatus: courseStatus.ApproveProjectExam },
        ],
      },
    })

    const projectUsersCount = await prisma.projectUser.count({
      where: {
        projectId: projectID,
      },
    })

    const result = {
      projectExamApprove: !!projectExists,
      projectCommitteeCountApprove: projectUsersCount === 3,
    }

    return result
  }

  static GetProjectUserDetail = async (projectId?: number, userId?: number) => {
    const projectUser = await prisma.projectUser.findMany({
      where: {
        projectId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return projectUser
  }

  static CheckUserIsAdvisor = async (userID: number, projectID: number) => {
    const isAdvisor =
      (await prisma.projectUser.count({
        where: {
          userId: userID,
          projectId: projectID,
          userProjectRole: {
            in: [userProjectRole.ADVISOR, userProjectRole.CO_ADVISOR],
          },
        },
      })) > 0

    return isAdvisor
  }

  static GetExamDateTimeByUserID = async (userID: number) => {
    const examDateTime = await prisma.project.findMany({
      where: {
        id: {
          in: await prisma.projectUser
            .findMany({
              where: {
                userId: userID,
              },
              select: {
                projectId: true,
              },
            })
            .then((users) => users.map((user) => user.projectId)),
        },
        examDateTime: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
        projectName: true,
        projectNameEng: true,
        examDateTime: true,
        examLocation: true,
        academicYear: true,
        projectAcademicYear: true,
      },
      orderBy: {
        examDateTime: 'asc',
      },
    })
    return examDateTime
  }
}
