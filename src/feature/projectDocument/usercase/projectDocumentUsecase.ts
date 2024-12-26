import { CreateProjectDocument } from '@/models/ProjectDocument'
import { ProjectDocumentRepository } from '../repository/projectDocumentRepository'
import { ProjectDocument } from '@prisma/client'

const projectDocumentRepo = ProjectDocumentRepository

export class ProjectDocumentUsecase {
  static CreateProjectDocument = async (req: CreateProjectDocument) => {
    return await projectDocumentRepo.CreateProjectDocument(req)
  }

  static GetProjectDocument = async (id: number) => {
    return await projectDocumentRepo.GetProjectDocumentByID(id)
  }

  static ListProjectDocument = async (
    projectId: number,
    documentId: number
  ) => {
    return await projectDocumentRepo.ListProjectDocument(projectId, documentId)
  }

  static UpdateProjectDocument = async (req: ProjectDocument) => {
    return await projectDocumentRepo.UpdateProjectDocument(req)
  }

  static DeleteProjectDocument = async (id: number) => {
    return await projectDocumentRepo.DeleteProjectDocument(id)
  }

  static ListLastDocsApproveInProject = async (projectId: number) => {
    return await projectDocumentRepo.ListLastDocsApproveInProject(projectId)
  }
}
