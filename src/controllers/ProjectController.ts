import { Request, Response } from 'express'

export const ListProjects = (req: Request, res: Response) => {
  res.json({ message: 'List Projects' })
}

export const FindProjectByID = (req: Request, res: Response) => {
  res.json({ message: 'Find Projects By ID' })
}

export const CreateProject = (req: Request, res: Response) => {
  res.json({ message: 'Create Project' })
}

export const DeleteProject = (req: Request, res: Response) => {
  res.json({ message: 'Delete Project' })
}

export const UpdateProject = (req: Request, res: Response) => {
  res.json({ message: 'Update Project' })
}
