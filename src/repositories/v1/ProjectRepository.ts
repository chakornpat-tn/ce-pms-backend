import { PrismaClient } from '@prisma/client'
import {
  CreateProjectRequest,
  ListProjectsFilter,
  UpdateProjectRequest,
  ProjectStudentRequest,
  UpdateProjectsRequest,
} from '@/models/Project'

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
      })

      return project
    })
  }

  const UpdateProject = async (projectData: UpdateProjectRequest) => {
    return await prisma.$transaction(async (prisma) => {
      const updatedProject = await prisma.project.update({
        where: { id: projectData.id },
        data: {
          ...(projectData.projectName && {
            projectName: projectData.projectName,
          }),
          ...(projectData.semester && { semester: projectData.semester }),
          ...(projectData.academicYear && {
            academicYear: projectData.academicYear,
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
          ...(projectData.students && {
            students: {
              deleteMany: {},
              create: projectData.students.map(
                (student: ProjectStudentRequest) => ({
                  student: {
                    connectOrCreate: {
                      where: { studentId: student.studentId },
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
              deleteMany: {},
              create: projectData.users.map((user) => ({
                user: { connect: { id: user.userId } },
              })),
            },
          }),
        },
      })

      return updatedProject
    })
  }
  const UpdateProjects = async (projectData: UpdateProjectsRequest) => {
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
      ...(projectData.type !== undefined && { type: projectData.type }),
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
    UpdateProjects,
    GetProjectById,
    DeleteProject,
    ListProjects,
  }
}

export default useProjectRepository
