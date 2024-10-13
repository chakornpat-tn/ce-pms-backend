import { Request, Response } from 'express'
import { CreateProjectRequest, ListProjectsFilter } from '@/models/Project'
import useProjectRepository from '@/repositories/v1/ProjectRepository'
import * as utils from '@/utils'

const title = 'Project Controller V1'
const projectRepo = useProjectRepository()

const ProjectController = () => {
  const CreateProject = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization
      const payload = await utils.GetTokenData(token)
      if (!payload) throw new Error(`Invalid token`)

      let formData: CreateProjectRequest = req.body
      const filteredUsers = formData.users
        ? formData.users.filter((userId) => userId !== payload.id)
        : []
      formData.users =
        formData.users && formData.users.length > 0
          ? [payload.id, filteredUsers[0]].slice(0, 2)
          : [payload.id]
      if (!formData.academicYear) {
        formData.academicYear = new Date().getFullYear() + 543
      }

      if (!formData.semester) {
        formData.semester = 1
      }

      formData.username = await utils.generateUsername()

      await projectRepo.CreateProject(formData)

      res.json(utils.SuccessMessage(title, 'Project created successfully'))
    } catch (error) {
      utils.logger.warn(
        error as Error,
        'ProjectController.CreateProject Error'
      )
      res
        .status(500)
        .json(utils.ErrorMessage(title, 'Failed to create project'))
    }
  }

  const ListProjects = async (req: Request, res: Response) => {
    try {
      const filter: ListProjectsFilter = {
        academicYear: Number(req.query.academicYear),
        semester: Number(req.query.semester),
        projectStatus: Number(req.query.projectStatus) || undefined,
        projectName: (req.query.projectName as string) || undefined,
      }
      const projects = await projectRepo.ListProjects(filter)
      res.json(
        utils.SuccessMessage(title, 'Projects retrieved successfully', projects)
      )
    } catch (error) {
      utils.logger.warn(
        error as Error,
        'ProjectController.ListProjects Error'
      )
      res
        .status(500)
        .json(utils.ErrorMessage(title, 'Failed to retrieve projects'))
    }
  }
  const GetProjectById = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id)
      const project = await projectRepo.GetProjectById(projectId)
      if (!project) {
        return res
          .status(404)
          .json(
            utils.NotFoundMessage(
              'Project not found',
              'The requested project does not exist'
            )
          )
      }
      res.json(
        utils.SuccessMessage(title, 'Project retrieved successfully', project)
      )
    } catch (error) {
      utils.logger.warn(
        error as Error,
        'ProjectController.GetProjectById Error'
      )
      res
        .status(500)
        .json(utils.ErrorMessage(title, 'Failed to retrieve project'))
    }
  }

  const UpdateProject = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id)
      const updateData = req.body
      const updatedProject = await projectRepo.UpdateProject(updateData)
      if (!updatedProject) {
        return res
          .status(404)
          .json(
            utils.NotFoundMessage(
              'Project not found',
              'The requested project does not exist'
            )
          )
      }
      res.json(
        utils.SuccessMessage(
          title,
          'Project updated successfully',
          updatedProject
        )
      )
    } catch (error) {
      utils.logger.warn(
        error as Error,
        'ProjectController.UpdateProject Error'
      )
      res
        .status(500)
        .json(utils.ErrorMessage(title, 'Failed to update project'))
    }
  }

  const DeleteProject = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id)
      const deletedProject = await projectRepo.DeleteProject(projectId)
      if (!deletedProject) {
        return res
          .status(404)
          .json(
            utils.NotFoundMessage(
              'Project not found',
              'The requested project does not exist'
            )
          )
      }
      res.json(
        utils.SuccessMessage(
          title,
          'Project deleted successfully',
        )
      )
    } catch (error) {
      utils.logger.warn(
        error as Error,
        'ProjectController.DeleteProject Error'
      )
      res
        .status(500)
        .json(utils.ErrorMessage(title, 'Failed to delete project'))
    }
  }

  return {
    CreateProject,
    ListProjects,
    GetProjectById,
    UpdateProject,
    DeleteProject,
  }
}

export default ProjectController
