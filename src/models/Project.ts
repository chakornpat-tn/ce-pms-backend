export interface CreateProjectRequest {
  id: number
  username: string
  password?: string
  projectName: string
  projectNameEng?: string
  abstract?: string
  abstractEng?: string
  detail?: string
  detailEng?: string
  semester?: number
  academicYear: number
  type?: string
  projectStatusId?: number
  students: ProjectStudentRequest[]
  users: number[]
}

export interface ProjectStudentRequest {
  studentId: string
  name: string
}

export interface ListProjectsFilter {
  academicYear?: number
  semester?: number
  projectName?: string
  projectStatus?: number
}
