import { ProgressReportRepository } from '../repository/progressReportRepository'
import config from '@/config'
import { CreateProgressReportRequest, UpdateProgressReport } from '@/models/ProgressReport'
import userRoles from '@/statics/constants/userRoles/userRoles'

const PReportRepo = ProgressReportRepository

export class ProgressReportUsecase {
  static CreateProgressReport = async (req: CreateProgressReportRequest) => {
    return await PReportRepo.CreateProgressReport(req)
  }

  static DeleteProgressReport = async (id: number) => {
    return await PReportRepo.DeleteProgressReport(id)
  }

  static ListProgressReport = async (projectId: number) => {
    return await PReportRepo.ListProgressReport(projectId)
  }

  static GetProgressReport = async (id: number) => {
    return await PReportRepo.GetProgressReport(id)
  }

  static UpdateProgressReport = async (
    id: number,
    req: UpdateProgressReport
  ) => {
    return await PReportRepo.UpdateProgressReport(id, req)
  }
}
