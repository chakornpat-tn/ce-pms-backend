import { Request, Response } from 'express'
import { generateUsername } from '../utils/helper/generateUsername'
import { decrypt } from '../utils/JWT/jwt'
import Project from '../models/Project'

export const ListProjects = (req: Request, res: Response) => {
  res.json({ message: 'List Projects' })
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

    const project = new Project({
      ...projectData,
    })

    await project.save()

    res
      .status(201)
      .json({ message: 'created project successfully : ' + project.title })
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
