import { Project } from './Project'

export type ProgressReport = {
  id: number
  title: string
  status: number
  report?: any
  reportResult?: any
  productProgress: number
  productUrl?: string
  docsProgress: number
  docsUrl?: string
  createAt: Date
  updatedAt: Date
  projectId: number
  project: Project
}

export type CreateProgressReportRequest = {
  title: string
  report?: ReportType
  productUrl?: string
  docsUrl?: string
  projectId: number
}

export type UpdateProgressReport = {
  title?: string
  status?: number
  report?: any
  reportResult?: any
  productProgress?: number
  productUrl?: string
  docsProgress: number
  docsUrl?: string
}

type ReportType = {
  section1?: string
  section2?: string
  section3?: string
  documentSections: {
    id: string
    percent: number
  }[]
  productProgress: number
}

export type CreateProgressReportRequestBody = {
  productFile?: File
  docsFile?:File
  data: string
}