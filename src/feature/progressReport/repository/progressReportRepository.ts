import {
  CreateProgressReportRequest,
  UpdateProgressReport,
} from '@/models/ProgressReport'
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
}
