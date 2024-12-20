export type ProjectUser = {
  projectId: number
  userId: number
  prepDocs?: string | null
  projectDocs?: string | null
  projectPoint?: number | null
  prepPoint?: number | null
  userProjectRole?: number
}

export type ProjectUserUploadRequest = {
  projectDocs?: File
  prepDocs?: File
  data: string
}

export type UpdateProjectUserRequest = {
  projectId: number
  userId: number
  prepDocs?: string | null
  projectDocs?: string | null
  projectPoint?: number | null
  prepPoint?: number | null
  userProjectRole?: number
}
