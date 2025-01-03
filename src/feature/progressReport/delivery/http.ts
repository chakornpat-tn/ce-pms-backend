import Elysia, { t } from 'elysia'
import bearer from '@elysiajs/bearer'
import * as middleWare from '@/middleware'
import { ProgressReportUsecase } from '../usercase/progressReportUsecase'
import * as utils from '@/utils'
import * as fs from 'fs/promises'
import {
  CreateProgressReportRequest,
  CreateProgressReportRequestBody,
  UpdateProgressReport,
} from '@/models/ProgressReport'
import { ProgressReport } from '@prisma/client'

const title = 'Progress Report Controller V1'
const PReportUsecase = ProgressReportUsecase

const ProgressReportSwaggerDetail = (summary: string, detail: string) => {
  return {
    tags: ['Progress Report'],
    summary: summary,
    detail: detail,
  }
}

export const ProgressReportDelivery = new Elysia({ prefix: '/progress-report' })
  .use(middleWare.JwtConfig)
  .use(bearer())
  .guard({
    beforeHandle: middleWare.checkAuthorization,
  })
  .get(
    '/wait-update/:userId',
    async ({ params, set }) => {
      try {
        const userId = params.userId
        const projectProgressUpdate = await PReportUsecase.GetProjectProgressReportUpdate(
          userId
        )
        return utils.SuccessMessage(
          title,
          'Get project progress report wait for update successfully',
          projectProgressUpdate
        )
      } catch (error) {
        utils.logger.warn(error as Error, 'ProgressReportWaitUpdate.Controller Error')
        set.status = 500
        return utils.ErrorMessage(
          title,
          'Failed to list project progress reports wait for update'
        )
      }
    },
    {
      params: t.Object({
        userId: t.Number(),
      }),
       detail: ProgressReportSwaggerDetail(
        'Get Project Progress Report Wait Update',
        'Get project progress report wait for update by user id'
      ),
    }
  )
  .get(
    '/project/:projectId',
    async ({ params, set }) => {
      try {
        const projectId = params.projectId
        const progressReports = await PReportUsecase.GetProjectProgressReport(
          projectId
        )
        return utils.SuccessMessage(
          title,
          'Get project progress report successfully',
          progressReports
        )
      } catch (error) {
        utils.logger.warn(error as Error, 'ProgressReport.Controller Error')
        set.status = 500
        return utils.ErrorMessage(
          title,
          'Failed to list project progress reports'
        )
      }
    },
    {
      params: t.Object({
        projectId: t.Number(),
      }),
      detail: ProgressReportSwaggerDetail(
        'Get Project Progress Report',
        'Get project progress report by project id'
      ),
    }
  )
  .get(
    '/:id',
    async ({ params, set }) => {
      try {
        const id = params.id
        const progressReports = await PReportUsecase.GetProgressReport(id)
        return utils.SuccessMessage(
          title,
          'Get progress report successfully',
          progressReports
        )
      } catch (error) {
        utils.logger.warn(error as Error, 'ProgressReport.Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Failed to list progress reports')
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      detail: ProgressReportSwaggerDetail(
        'Get Progress Report',
        'Get a progress report by id'
      ),
    }
  )
  .delete(
    '/:id',
    async ({ params, set }) => {
      try {
        const id = params.id

        const progress = await PReportUsecase.DeleteProgressReport(id)
        if (progress.docsUrl || progress.productUrl) {
          const gcs = utils.GCS
          try {
            if (progress.docsUrl) await gcs.DeleteFile(progress.docsUrl)
            if (progress.productUrl) await gcs.DeleteFile(progress.productUrl)
          } catch (error) {
            console.log('error', error)
          }
        }

        return utils.SuccessMessage(
          title,
          'Delete progress report successfully'
        )
      } catch (error) {
        utils.logger.warn(error as Error, 'ProgressReport.Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Failed to delete progress report')
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      detail: ProgressReportSwaggerDetail(
        'Delete Progress Report',
        'Delete a progress report by id'
      ),
    }
  )
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const projectId = query.projectId
        const progressReports = await PReportUsecase.ListProgressReport(
          projectId
        )
        return utils.SuccessMessage(
          title,
          'List progress reports successfully',
          progressReports
        )
      } catch (error) {
        utils.logger.warn(error as Error, 'ProgressReport.Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Failed to list progress reports')
      }
    },
    {
      query: t.Object({
        projectId: t.Number(),
      }),
      detail: ProgressReportSwaggerDetail(
        'List Progress Reports',
        'List progress reports by project id'
      ),
    }
  )
  .post(
    '/',
    async ({ body, set }) => {
      let tempFilePath1: string | null = null
      let tempFilePath2: string | null = null
      let url1: string | null = null
      let url2: string | null = null
      const gcs = utils.GCS
      try {
        const req = body as CreateProgressReportRequestBody
        const data = JSON.parse(req.data) as CreateProgressReportRequest

        // Handle first file
        const timestamp1 = new Date()
          .toISOString()
          .replace(/[-:T]/g, '')
          .slice(0, 12)

        if (req.productFile) {
          const destination1 = `${timestamp1}-prod${data.projectId}.pdf`
          tempFilePath1 = `tmp/${destination1}`
          await Bun.write(tempFilePath1, req.productFile)
          url1 = await gcs.UploadFile(
            tempFilePath1,
            destination1,
            'progress-report'
          )
        }

        if (req.docsFile) {
          const destination2 = `${timestamp1}-docs${data.projectId}.pdf`
          tempFilePath2 = `tmp/${destination2}`
          await Bun.write(tempFilePath2, req.docsFile)
          url2 = await gcs.UploadFile(
            tempFilePath2,
            destination2,
            'progress-report'
          )
        }

        if (url1) data.productUrl = url1
        if (url2) data.docsUrl = url2

        await PReportUsecase.CreateProgressReport(data)

        if (tempFilePath1) await fs.rm(tempFilePath1)
        if (tempFilePath2) await fs.rm(tempFilePath2)

        return utils.SuccessMessage(
          title,
          'Create Progress Report successfully'
        )
      } catch (error) {
        if (tempFilePath1) await fs.rm(tempFilePath1)
        if (tempFilePath2) await fs.rm(tempFilePath2)

        if (url1) await gcs.DeleteFile(url1)
        if (url2) await gcs.DeleteFile(url2)

        utils.logger.warn(error, 'Create ProgressReport.Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Create Progress Report failed')
      }
    },
    {
      body: t.Object({
        productFile: t.Optional(t.File()),
        docsFile: t.Optional(t.File()),
        data: t.String(),
      }),
      detail: ProgressReportSwaggerDetail(
        'Create Progress Report',
        'Create a progress report'
      ),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      let tempFilePath1: string | null = null
      let tempFilePath2: string | null = null
      let url1: string | null = null
      let url2: string | null = null
      const gcs = utils.GCS
      try {
        const id = params.id
        const req = body as CreateProgressReportRequestBody
        const data = JSON.parse(req.data) as UpdateProgressReport

        const timestamp1 = new Date()
          .toISOString()
          .replace(/[-:T]/g, '')
          .slice(0, 12)

        const PReport = (await PReportUsecase.GetProgressReport(
          id
        )) as ProgressReport

        if (req.productFile) {
          try {
            if (PReport.productUrl) await gcs.DeleteFile(PReport.productUrl)
          } catch (error) {
            console.log('error', error)
          }
          const destination1 = `${timestamp1}-prod${data.projectId}.pdf`
          tempFilePath1 = `tmp/${destination1}`
          await Bun.write(tempFilePath1, req.productFile)
          url1 = await gcs.UploadFile(
            tempFilePath1,
            destination1,
            'progress-report'
          )
        }

        if (req.docsFile) {
          try {
            if (PReport.docsUrl) await gcs.DeleteFile(PReport.docsUrl)
          } catch (error) {
            console.log('error', error)
          }
          const destination2 = `${timestamp1}-docs${data.projectId}.pdf`
          tempFilePath2 = `tmp/${destination2}`
          await Bun.write(tempFilePath2, req.docsFile)
          url2 = await gcs.UploadFile(
            tempFilePath2,
            destination2,
            'progress-report'
          )
        }

        if (url1) data.productUrl = url1
        if (url2) data.docsUrl = url2

        await PReportUsecase.UpdateProgressReport(id, data)

        if (tempFilePath1) await fs.rm(tempFilePath1)
        if (tempFilePath2) await fs.rm(tempFilePath2)

        return utils.SuccessMessage(
          title,
          'Update progress report successfully'
        )
      } catch (error) {
        if (tempFilePath1) await fs.rm(tempFilePath1)
        if (tempFilePath2) await fs.rm(tempFilePath2)

        if (url1) await gcs.DeleteFile(url1)
        if (url2) await gcs.DeleteFile(url2)

        utils.logger.warn(error, 'Update ProgressReport.Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'Update Progress Report failed')
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      body: t.Object({
        productFile: t.Optional(t.File()),
        docsFile: t.Optional(t.File()),
        data: t.String(),
      }),
      detail: ProgressReportSwaggerDetail(
        'Update Progress Report',
        'Update a progress report'
      ),
    }
  )
