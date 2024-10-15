export interface Project {
  id: number
  username: string
  password?: string | null
  projectName: string
  projectNameEng?: string | null
  abstract?: string | null
  abstractEng?: string | null
  detail?: string | null
  detailEng?: string | null
  semester: number
  academicYear: number
  type?: string | null
  projectStatusId?: number | null
  projectStatus?: ProjectStatus | null
  courseStatus: number
  students: ProjectStudent[]
  users: ProjectUser[]
  createdAt: Date
  updatedAt: Date
}
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

export interface UpdateProjectRequest {
  id: number
  password?: string | null
  projectName: string
  projectNameEng?: string | null
  abstract?: string | null
  abstractEng?: string | null
  detail?: string | null
  detailEng?: string | null
  semester: number
  academicYear: number
  type?: string | null
  projectStatusId?: number | null
  projectStatus?: ProjectStatus | null
  courseStatus: number
  students: ProjectStudentRequest[]
  users: ProjectUser[]
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

export interface ProjectStudent {
  projectId: number
  studentId: number
}

export interface ProjectUser {
  id: number
  projectId: number
  userId: number
}
