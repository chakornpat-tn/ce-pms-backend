import {
  CreateProgressReportRequest,
  UpdateProgressReport,
} from '@/models/ProgressReport'
import progressReportStatus from '@/statics/constants/progressReport/status'
import userProjectRole from '@/statics/constants/userProjectRole/userProjectRole'
import userRoles from '@/statics/constants/userRoles/userRoles'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ProgressReportRepository {
  static CreateProgressReport = async (req: CreateProgressReportRequest) => {
    return await prisma.progressReport.create({
      data: req,
    })
  }

  static DeleteProgressReport = async (id: number) => {
    return await prisma.progressReport.delete({
      where: {
        id,
      },
    })
  }

  static ListProgressReport = async (projectId: number) => {
    return await prisma.progressReport.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createAt: 'desc',
      },
      select: {
        id: true,
        projectId: true,
        title: true,
        status: true,
        createAt: true,
        updatedAt: true,
      },
    })
  }

  static GetProgressReport = async (id: number) => {
    return await prisma.progressReport.findUnique({
      where: {
        id,
      },
    })
  }
  static UpdateProgressReport = async (
    id: number,
    req: UpdateProgressReport
  ) => {
    return await prisma.progressReport.update({
      where: {
        id,
      },
      data: req,
    })
  }

  static GetProjectProgressReport = async (projectId : number) => {
    return await prisma.progressReport.findFirst({
          where: {
            projectId,
          },
          orderBy: {
            updatedAt: 'desc',
          },
          select: {
            id: true,
            projectId: true,
            productProgress: true,
            docsProgress: true,
            updatedAt: true,
          },
        })
    
  }

  static GetProjectProgressReportUpdate = async (userID:number) => {
    return await prisma.progressReport.findMany({
      where: {
        status: progressReportStatus.WAITING,
        project: {
          users: {
            some: {
              userId: userID,
              userProjectRole: {
                in: [userProjectRole.ADVISOR, userProjectRole.CO_ADVISOR],
              },
            }
          }
        }
      },
      select: {
        project: {
          select: {
            id: true,
            projectName: true
          }
        },
        id: true,
        title: true,
        createAt: true
      }
    })
  }

}
