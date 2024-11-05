export type ProjectUser = {
  projectId: number
  userId: number
  userProjectRole?: number
  projectDocs?: string | null
  prepDocs?: string | null
}

export type ProjectUserUploadRequest = {
  projectDocs?: File
  prepDocs?: File
  data: string
}

export type UpdateProjectUserRequest = {
  projectId: number
  userId: number
  userProjectRole?: number
  projectDocs?: string 
  prepDocs?: string 
}
