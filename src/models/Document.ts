export interface Document {
  id: number
  name: string
  course: number
  isActive: boolean
  submissionOpen: boolean
}
  export interface UpdateDocumentRequest {
    id?: number
    name: string
    course: number
    isActive?: boolean
    submissionOpen?: boolean
  }

  export interface ListDocumentRequest {
    course?: number
    search?: string
    isActive?: boolean
    submissionOpen?: boolean
  }
