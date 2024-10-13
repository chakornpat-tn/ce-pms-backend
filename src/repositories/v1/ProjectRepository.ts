import { CreateProjectRequest, ListProjectsFilter } from '@/models/Project'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const useProjectRepository = () => {
  const CreateProject = async (projectData: CreateProjectRequest) => {
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

          // Connect relations with users
          users: {
            create: projectData.users.map((id) => ({
              user: {
                connect: {
                  id: id,
                },
              },
            })),
          },
        },
        include: {
          students: {
            include: {
              student: true,
            },
          },
          users: {
            include: {
              user: true,
            },
          },
          projectStatus: true,
        },
      })

      return project
    })
  }

  const UpdateProject = async (projectData: any) => {
    return await prisma.$transaction(async (prisma) => {
      const updatedProject = await prisma.project.update({
        where: { id: projectData.id },
        data: {
          username: projectData.username,
          projectName: projectData.projectName,
          semester: projectData.semester,
          academicYear: projectData.academicYear,
          password: projectData.password,
          projectNameEng: projectData.projectNameEng,
          abstract: projectData.abstract,
          abstractEng: projectData.abstractEng,
          detail: projectData.detail,
          detailEng: projectData.detailEng,
          type: projectData.type,
          projectStatusId: projectData.projectStatusId,
          students: {
            deleteMany: {},
            create: projectData.students.map((student: any) => ({
              student: {
                connectOrCreate: {
                  where: { studentId: student.studentId },
                  create: {
                    studentId: student.studentId,
                    name: student.name,
                  },
                },
              },
            })),
          },
          users: {
            deleteMany: {},
            create: projectData.users.map((id: number) => ({
              user: { connect: { id } },
            })),
          },
        },
        include: {
          students: {
            include: {
              student: true,
            },
          },
          users: {
            include: {
              user: true,
            },
          },
          projectStatus: true,
        },
      })
      return updatedProject
    })
  }

  const DeleteProject = async (id: number) => {
    return await prisma.$transaction(async (prisma) => {
      return await prisma.project.delete({
        where: { id },
      })
    })
  }
  const GetProjectById = async (id: number) => {
    return await prisma.project.findUnique({
      where: { id },
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
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
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

  const ListProjects = async (filter: ListProjectsFilter) => {
    const { academicYear, semester, projectName, projectStatus } = filter

    return await prisma.project.findMany({
      where: {
        ...(academicYear && { academicYear }),
        ...(semester && { semester }),
        ...(projectName && {
          projectName: {
            contains: projectName,
            mode: 'insensitive',
          },
        }),
        ...(projectStatus && {
          projectStatusId: projectStatus,
        }),
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
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
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

  return {
    CreateProject,
    UpdateProject,
    GetProjectById,
    DeleteProject,
    ListProjects,
  }
}

export default useProjectRepository
