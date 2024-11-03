export type ProjectStatus =  {
  id: number
  name: string
  course: number
  textColor: string
  bgColor: string
  isActive: boolean
}

export type UpdateProjectStatusRequest =  {
  id?: number
  name: string
  course: number
  textColor: string
  bgColor: string
  isActive?: boolean
}

export type ListProjectStatusRequest =  {
  course?: number
  search?: string
  isActive?: boolean
}
