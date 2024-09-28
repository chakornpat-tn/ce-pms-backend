import { Request, Response } from 'express'
import { generateUsername } from '../utils/helper/generateUsername'
import { decrypt } from '../utils/JWT/jwt'
import * as projectRepo from '../repositories/v1/ProjectRepository'

export const ListProjects = async (req: Request, res: Response) => {
  try {
    const { academicYear, semester, title, documentStatus, projectStatus } =
      req.query

    const filter: projectRepo.ListProjectsFilter = {
      ...(academicYear && { academicYear: Number(academicYear) }),
      ...(semester && { semester: Number(semester) }),
      ...(title && { title: String(title) }),
    }

    const statusFilter: { [key: string]: string } = {}
    if (documentStatus)
      statusFilter['status.documentStatus'] = String(documentStatus)
    if (projectStatus)
      statusFilter['status.projectStatus'] = String(projectStatus)

    if (Object.keys(statusFilter).length > 0) {
      Object.assign(filter, statusFilter)
    }

    // const projects = await projectRepo.ListProjects(filter)

    return res.status(200).json()
  } catch (error) {
    console.error('Error:', (error as Error).message)
    res.status(500).json({ message: (error as Error).message })
  }
}

export const FindProjectByID = (req: Request, res: Response) => {
  res.json({ message: 'Find Projects By ID' })
}

export const CreateProject = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token || undefined
    if (token == undefined) throw new Error(`Invalid token`)

    const formData = req.body
    if (!formData.title) throw new Error(`Invalid title project name.`)
    const title = formData.title
    const username = await generateUsername()
    const tokenData = (await decrypt(token)) as { id: string; name: string }
    const developers = formData.developers
    let advisors = [{ advisorId: tokenData.id, name: tokenData.name }]
    if (!!formData.advisors) {
      advisors = [...advisors, ...formData.advisors]
    }
    let academicYear: number
    if (!formData.academicYear)
      academicYear = Number(new Date().getFullYear() + 543)
    else academicYear = Number(formData.academicYear)

    const projectData = {
      title,
      username,
      academicYear,
      status: {
        documentStatus: '',
        projectStatus: 'ดำเนินการเตรียมโครงงาน',
      },
      developers,
      advisors,
      updateBy: tokenData.name,
    }

    // Save project to database
    const project = await projectRepo.CreateProject(projectData)

    res.status(200).json(project.title)
  } catch (error) {
    res.json({ message: (error as Error).message })
  }
}

export const DeleteProject = (req: Request, res: Response) => {
  res.json({ message: 'Delete Project' })
}

export const UpdateProject = (req: Request, res: Response) => {
  res.json({ message: 'Update Project' })
}
