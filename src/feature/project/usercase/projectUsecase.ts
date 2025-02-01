import { ProjectRepository } from '../repository/projectRepository'
import config from '@/config'
import * as utils from '@/utils'
import {
  ListProjectsFilter,
  UpdateProjectRequest,
  UpdateProjectsRequest,
  CreateProjectRequest,
} from '@/models/Project'

const projectRepo = ProjectRepository

export class ProjectUsecase {
  static ListProjects = async (filter: ListProjectsFilter) => {
    const projects = await projectRepo.ListProjects(filter)
    return projects
  }

  static GetProjectById = async (id: number) => {
    const project = await projectRepo.GetProjectById(id)
    return project
  }

  static DeleteProject = async (id: number) => {
    const project = await projectRepo.DeleteProject(id)
    return project
  }

  static UpdateProject = async (projectData: UpdateProjectRequest) => {
    if (projectData.password) {
      const passwordHash = await Bun.password.hash(projectData.password, {
        algorithm: 'bcrypt',
        cost: config.SALT_ROUNDS,
      })
      projectData.password = passwordHash
    }
    const updatedProject = await projectRepo.UpdateProject(projectData)
    return updatedProject
  }

  static UpdateProjects = async (projectData: UpdateProjectsRequest) => {
    const updatedProjects = await projectRepo.UpdateProjects(projectData)
    return updatedProjects
  }

  static CreateProject = async (projectData: CreateProjectRequest) => {
    projectData.academicYear =
      projectData.academicYear || new Date().getFullYear() + 543
    projectData.semester = projectData.semester || 1
    projectData.username = await utils.generateUsername()
    if (projectData.password) {
      const passwordHash = await Bun.password.hash(projectData.password, {
        algorithm: 'bcrypt',
        cost: config.SALT_ROUNDS,
      })
      projectData.password = passwordHash
    }

    const project = await projectRepo.CreateProject(projectData)
    return project
  }

  static ListProjectPassPre = async (req: ListProjectsFilter) => {
    return projectRepo.ListProjectPassPre(req)
  }

  static GetMaxProjectAcademicYear = async () => {
    return await projectRepo.GetMaxProjectAcademicYear()
  }

}
