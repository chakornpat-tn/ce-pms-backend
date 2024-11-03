type ProjectDocument = {
  id: number
  projectId: number
  documentId: number
  documentName: string
  documentUrl: string
  status: number
  createdAt: Date
  updatedAt: Date
}

export type ProjectDocumentRequest = {
  document: File
  data: string
}