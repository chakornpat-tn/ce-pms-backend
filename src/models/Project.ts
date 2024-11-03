export type Project = {
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
  courseStatus: number
  students: ProjectStudent[]
  users: ProjectUser[]
  createdAt: Date
  updatedAt: Date
  examDateTime: Date
}
export type CreateProjectRequest = {
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
  users: ProjectUser[]
}

export type UpdateProjectRequest = {
  id: number
  password?: string
  projectName: string
  projectNameEng?: string
  abstract?: string
  abstractEng?: string
  detail?: string
  detailEng?: string
  semester?: number
  academicYear?: number
  type?: string | null
  projectStatusId?: number | null
  courseStatus?: number
  students?: ProjectStudentRequest[]
  users?: ProjectUser[]
  examDateTime: Date
}

export type UpdateProjectsRequest = {
  ids: number[]
  courseStatus?: number
  projectStatusId?: number | null
  semester?: number
  academicYear?: number
  type?: string | null
}

export type ProjectStudentRequest = {
  studentId: string
  name: string
}

export type ListProjectsFilter = {
  academicYear?: number
  semester?: number
  projectName?: string
  projectStatus?: number[]
  courseStatus?: number[]
}

export type ProjectStudent = {
  projectId: number
  studentId: number
}

export type ProjectUser = {
  projectId?: number
  userId: number
  userProjectRole: number
  projectDocs?: string
  prepDocs?: string
}