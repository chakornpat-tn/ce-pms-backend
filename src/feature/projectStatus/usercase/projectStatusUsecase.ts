import { ProjectStatusRepository } from '../repository/projectStatusRepository'
import {
  ProjectStatus,
  UpdateProjectStatusRequest,
  ListProjectStatusRequest,
} from '@/models/ProjectStatus'

const projectStatusRepo = ProjectStatusRepository

export class ProjectStatusUsecase {
  static CreateProjectStatus = async (req: ProjectStatus) => {
    return await projectStatusRepo.CreateProjectStatus(req)
  }

  static UpdateProjectStatus = async (req: UpdateProjectStatusRequest[]) => {
    return await projectStatusRepo.UpdateProjectStatus(req)
  }

  static ListProjectStatus = async (req: ListProjectStatusRequest) => {
    if (!req.course) req.course = 1
    return await projectStatusRepo.ListProjectStatus(req)
  }

  static DeleteProjectStatus = async (id: number) => {
    return await projectStatusRepo.DeleteProjectStatus(id)
  }

}
