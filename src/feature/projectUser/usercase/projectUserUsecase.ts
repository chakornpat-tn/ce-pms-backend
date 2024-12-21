import { ProjectUserRepository } from '../repository/projectUserRepository'
import { ListProjectsFilter } from '@/models/Project'
import { UpdateProjectUserRequest } from '@/models/ProjectUser'
import { ProjectUser } from '@prisma/client'

const projectUserRepo = ProjectUserRepository

export class ProjectUserUsecase {
  static CreateProjectUser = async (projectUser: ProjectUser) => {
    return await projectUserRepo.CreateProjectUSer(projectUser)
  }

  static UpdateProjectUser = async (projectUser: UpdateProjectUserRequest) => {
    return await projectUserRepo.UpdateProjectUser(projectUser)
  }

  static DeleteProjectUser = async (projectId: number, userId: number) => {
    return await projectUserRepo.DeleteProjectUser(projectId, userId)
  }

  static ListProjectUser = async (userId: number, req: ListProjectsFilter) => {
    return await projectUserRepo.ListProjectUser(userId, req)
  }

  static GetProjectUser = async (projectId: number, userId: number) => {
    return await projectUserRepo.GetProjectUSer(projectId, userId)
  }

  static GetProjectsWithIncompleteUsers = async (
    req: ListProjectsFilter,
    userId: number
  ) => {
    const incompleteProject =
      await projectUserRepo.GetProjectsWithIncompleteUsers(req)
    const projectIDs = incompleteProject.map((item) => item.projectId)
    const projects = await projectUserRepo.GetProjectByIDs(projectIDs,userId)
    return projects
  }

  static GetProjectInCommitteeByUserID = async (
    userId: number,
    filter: ListProjectsFilter
  ) => {
    return await projectUserRepo.GetProjectInCommitteeByUserID(userId, filter)
  }

  static CheckStatusRegisExamDateTime = async (projectID: number) => {
    return await projectUserRepo.CheckStatusRegisExamDateTime(projectID)
  }
  static GetProjectUserDetail = async (projectId?: number, userId?: number) => {
    return await projectUserRepo.GetProjectUserDetail(projectId, userId)
  }
}
