export interface ProjectStatus {
  id: number
  name: string
  course: number
  textColor: string
  bgColor: string
  isActive: boolean
}

export interface CreateOrUpdateProjectStatusRequest {
  id?: number
  name: string
  course: number
  textColor: string
  bgColor: string
  isActive?: boolean
}

export interface ListProjectStatusRequest {
  course: number
  search?: string
  isActive?: boolean
}
