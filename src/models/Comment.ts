interface Comment {
  id: number
  content: string
  projectDocumentId: number
  projectDocumentEditId: number | null
  createdAt: Date
  updatedAt: Date
}

export interface UpdateCommentsRequest {
  ids: number[]
  content: string
  projectDocumentEditId: number | null
}
