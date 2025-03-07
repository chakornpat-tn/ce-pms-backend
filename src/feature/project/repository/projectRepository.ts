import { PrismaClient } from '@prisma/client'
import {
  CreateProjectRequest,
  ListProjectsFilter,
  UpdateProjectRequest,
  ProjectStudentRequest,
  UpdateProjectsRequest,
  ProjectCommitteePointRes,
} from '@/models/Project'
import course from '@/statics/constants/course/course'
import courseStatus from '@/statics/constants/course/courseStatus'

const prisma = new PrismaClient()
export class ProjectRepository {
  static CreateProject = async (projectData: CreateProjectRequest) => {
    return await prisma.$transaction(async (prisma) => {
      // Create project with all relations
      const project = await prisma.project.create({
        data: {
          // Required fields
          username: projectData.username,
          projectName: projectData.projectName,
          semester: projectData.semester,
          academicYear: projectData.academicYear,

          // Optional fields
          password: projectData.password,
          projectNameEng: projectData.projectNameEng,
          abstract: projectData.abstract,
          abstractEng: projectData.abstractEng,
          detail: projectData.detail,
          detailEng: projectData.detailEng,
          type: projectData.type,
          projectStatusId: projectData.projectStatusId || null,

          // Create relations with students
          ...(projectData.students && {
            students: {
              create: projectData.students.map((student) => ({
                student: {
                  connectOrCreate: {
                    where: {
                      studentId: student.studentId,
                    },
                    create: {
                      studentId: student.studentId,
                      name: student.name,
                    },
                  },
                },
              })),
            },
          }),
          // Connect relations with users
          users: {
            create: projectData.users.map((user) => ({
              user: { connect: { id: user.userId } },
              userProjectRole: user.userProjectRole,
              committeeProject: user.committeeProject,
            })),
          },
        },
      })

      return project
    })
  }
  static UpdateProject = async (projectData: UpdateProjectRequest) => {
    const updateProject = await prisma.$transaction(async (prisma) => {
      const updatedProject = await prisma.project.update({
        where: { id: projectData.id },
        data: {
          ...(projectData.projectName && {
            projectName: projectData.projectName,
          }),
          ...(projectData.semester && { semester: projectData.semester }),
          ...(projectData.projectSemester && {
            projectSemester: projectData.projectSemester,
          }),
          ...(projectData.academicYear && {
            academicYear: projectData.academicYear,
          }),
          ...(projectData.projectAcademicYear && {
            projectAcademicYear: projectData.projectAcademicYear,
          }),
          ...(projectData.password && { password: projectData.password }),
          ...(projectData.projectNameEng && {
            projectNameEng: projectData.projectNameEng,
          }),
          ...(projectData.abstract && { abstract: projectData.abstract }),
          ...(projectData.abstractEng && {
            abstractEng: projectData.abstractEng,
          }),
          ...(projectData.detail && { detail: projectData.detail }),
          ...(projectData.detailEng && { detailEng: projectData.detailEng }),
          ...(projectData.type && { type: projectData.type }),
          ...(projectData.projectStatusId && {
            projectStatusId: projectData.projectStatusId,
          }),
          ...(projectData.courseStatus !== undefined && {
            courseStatus: projectData.courseStatus,
          }),
          ...(projectData.examDateTime !== undefined && {
            examDateTime: projectData.examDateTime,
          }),
          ...(projectData.examLocation !== undefined && {
            examLocation: projectData.examLocation,
          }),

          ...(projectData.students && {
            students: {
              deleteMany: {},
              create: projectData.students.map(
                (student: ProjectStudentRequest) => ({
                  student: {
                    connectOrCreate: {
                      where: {
                        studentId: student.studentId,
                      },
                      create: {
                        studentId: student.studentId,
                        name: student.name,
                      },
                    },
                  },
                })
              ),
            },
          }),

          ...(projectData.users && {
            users: {
              deleteMany: {
                projectId: projectData.id,
                userId: {
                  notIn: projectData.users.map((user) => user.userId),
                },
              },
              upsert: projectData.users.map((user) => ({
                where: {
                  projectId_userId: {
                    projectId: projectData.id,
                    userId: user.userId,
                  },
                },
                update: {
                  userProjectRole: user.userProjectRole,
                  committeeProject: user.committeeProject,
                },
                create: {
                  user: { connect: { id: user.userId } },
                  userProjectRole: user.userProjectRole,
                  committeeProject: user.committeeProject,
                },
              })),
            },
          }),
        },
      })

      if (projectData.students) {
        await Promise.all(
          projectData.students.map((student: ProjectStudentRequest) =>
            prisma.student.update({
              where: {
                studentId: student.studentId,
              },
              data: {
                name: student.name,
              },
            })
          )
        )
      }

      return updatedProject
    })

    return updateProject
  }
  static UpdateProjects = async (projectData: UpdateProjectsRequest) => {
    const updateData = {
      ...(projectData.courseStatus !== undefined && {
        courseStatus: projectData.courseStatus,
      }),
      ...(projectData.projectStatusId !== undefined && {
        projectStatusId: projectData.projectStatusId,
      }),
      ...(projectData.semester !== undefined && {
        semester: projectData.semester,
      }),
      ...(projectData.academicYear !== undefined && {
        academicYear: projectData.academicYear,
      }),
      ...(projectData.projectSemester !== undefined && {
        projectSemester: projectData.projectSemester,
      }),
      ...(projectData.projectAcademicYear !== undefined && {
        projectAcademicYear: projectData.projectAcademicYear,
      }),
      ...(projectData.type !== undefined && { type: projectData.type }),
      ...(projectData.examDateTime !== undefined && {
        examDateTime: projectData.examDateTime,
      }),
      ...(projectData.examLocation !== undefined && {
        examLocation: projectData.examLocation,
      }),
    }

    return await prisma.project.updateMany({
      where: {
        id: {
          in: projectData.ids,
        },
      },
      data: updateData,
    })
  }

  static DeleteProject = async (id: number) => {
    return await prisma.$transaction(async (prisma) => {
      return await prisma.project.delete({
        where: { id },
      })
    })
  }

  static GetProjectById = async (id: number) => {
    return await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        projectName: true,
        projectNameEng: true,
        abstract: true,
        abstractEng: true,
        detail: true,
        detailEng: true,
        semester: true,
        projectSemester: true,
        academicYear: true,
        projectAcademicYear: true,
        type: true,
        projectStatusId: true,
        createdAt: true,
        updatedAt: true,
        examDateTime: true,
        examLocation: true,
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
        users: {
          orderBy: {
            userProjectRole: 'asc',
          },
          select: {
            userProjectRole: true,
            committeeProject: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        courseStatus: true,
        projectStatus: {
          select: {
            id: true,
            name: true,
            textColor: true,
            bgColor: true,
          },
        },
      },
    })
  }

  static ListProjects = async (filter: ListProjectsFilter) => {
    const {
      academicYear,
      semester,
      projectName,
      projectStatus,
      courseStatus,
      projectSemester,
      projectAcademicYear,
    } = filter

    const whereConditions = {
      ...(projectName && {
        projectName: {
          contains: projectName,
          mode: 'insensitive' as const,
        },
      }),
      ...(projectStatus && {
        projectStatusId: {
          in: projectStatus,
        },
      }),
      ...(courseStatus && {
        courseStatus: {
          in: courseStatus,
        },
      }),
      ...(semester &&
        projectSemester && {
          OR: [{ semester: semester }, { projectSemester: projectSemester }],
        }),
      ...(semester && !projectSemester && { semester }),
      ...(projectSemester && !semester && { projectSemester }),

      ...(academicYear &&
        projectAcademicYear && {
          OR: [
            { academicYear: academicYear },
            { projectAcademicYear: projectAcademicYear },
          ],
        }),
      ...(academicYear && !projectAcademicYear && { academicYear }),
      ...(projectAcademicYear && !academicYear && { projectAcademicYear }),
    }

    const selectFields = {
      id: true,
      username: true,
      projectName: true,
      abstract: false,
      semester: true,
      academicYear: true,
      projectSemester: true,
      projectAcademicYear: true,
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
    }

    return await prisma.project.findMany({
      where: whereConditions,
      ...(!academicYear && !projectAcademicYear && { take: 20 }),
      orderBy: [
        {
          projectAcademicYear: 'asc',
        },
        {
          updatedAt: 'desc',
        },
      ],
      select: selectFields,
    })
  }

  static async ListProjectPassPre(req: ListProjectsFilter) {
    const { projectName } = req
    return await prisma.project.findMany({
      where: {
        academicYear: {
          gte: req.academicYear,
        },
        courseStatus: courseStatus.PassPre,
        ...(req.semester && { semester: req.semester }),
        ...(req.projectName && {
          OR: [
            {
              projectName: {
                contains: projectName,
                mode: 'insensitive' as const,
              },
            },
            {
              username: {
                contains: projectName,
                mode: 'insensitive' as const,
              },
            },
          ],
        }),
      },
    })
  }

  static async GetMaxProjectAcademicYear() {
    const projectAcademicYear = await prisma.project.aggregate({
      _max: {
        academicYear: true,
        projectAcademicYear: true,
      },
    })

    return projectAcademicYear._max
  }

  static async GetProjectCommitteePoint(
    academicYear: number,
    semester: number,
    courseSelect: number
  ): Promise<ProjectCommitteePointRes[]> {
    const project = await prisma.project.findMany({
      where: {
        ...(courseSelect === course.PreProject
          ? {
              semester: semester,
              academicYear: academicYear,
            }
          : {
              projectSemester: semester,
              projectAcademicYear: academicYear,
            }),
        users: {
          some: {
            committeeProject: true,
          },
        },
      },
      select: {
        id: true,
        projectName: true,
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
          orderBy:{
            student:{
              studentId:'asc'
            }
          }
        },
        users: {
          select: {
            userProjectRole: true,
            ...(courseSelect === course.PreProject
              ? {
                  prepPoint: true,
                }
              : {
                  projectPoint: true,
                }),
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy:{
            userProjectRole:'asc'
          }
        },
      },
    })
    return project
  }
}
