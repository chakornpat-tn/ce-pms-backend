export type Document = {
  id: number
  name: string
  course: number
  isActive: boolean
  submissionOpen: boolean
}
  export type UpdateDocumentRequest = {
    id?: number
    name: string
    course: number
    isActive?: boolean
    submissionOpen?: boolean
  }

  export type ListDocumentRequest = {
    course?: number
    search?: string
    isActive?: boolean
    submissionOpen?: boolean
  }
