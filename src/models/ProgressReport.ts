import { Project } from './Project'

export type ProgressReport = {
  id: number
  title: string
  status: number
  report?: ReportType
  reportResult?: ReportResultType
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
  report?: ReportType
  reportResult?: ReportResultType
  productProgress?: number
  productUrl?: string
  docsProgress: number
  docsUrl?: string
  projectId?: number
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

export type ReportResultType = {
  questionSections: {
    question1?: number
    question2?: number
    question3?: number
    question4?: number
  }
  comment?: string
}

export type CreateProgressReportRequestBody = {
  productFile?: File
  docsFile?: File
  data: string
}