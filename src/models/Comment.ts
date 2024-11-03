type Comment = {
  id: number
  content: string
  projectDocumentId: number
  projectDocumentEditId: number | null
  createdAt: Date
  updatedAt: Date
}

export type UpdateCommentsRequest = {
  ids: number[]
  content: string
  projectDocumentEditId: number | null
}
