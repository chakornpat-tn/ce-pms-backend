import { Elysia } from 'elysia'
import { UserDelivery } from '@/feature/user/delivery/http'
import { ProjectDelivery } from '@/feature/project/delivery/http'
import { AuthDelivery } from '@/feature/auth/delivery/http'
import { ProjectStatusDelivery } from '@/feature/projectStatus/delivery/http'
import { CommentDelivery } from '@/feature/comment/delivery/http'
import { DocumentDelivery } from '@/feature/document/delivery/http'
import { ProjectDocumentDelivery } from '@/feature/projectDocument/delivery/http'

import * as utils from '@/utils'

const app = new Elysia()
  .get('/', () => utils.SuccessMessage('CE-PMS API', 'Health Check'))
  .group('/v1', (app) =>
    app
      .use(AuthDelivery)
      .use(UserDelivery)
      .use(ProjectDelivery)
      .use(DocumentDelivery)
      .use(CommentDelivery)
      .use(ProjectDocumentDelivery)
      .use(ProjectStatusDelivery)
  )
  .onError(({ code, error }) => {
    switch (code) {
      case 'NOT_FOUND':
        return utils.ErrorMessage('Not Found', error.message)
      case 'VALIDATION':
        utils.logger.warn(error, 'Error validation bad request')
        return utils.ErrorMessage(
          'Error bad request',
          error.validator.Errors(error.value).First().message
        )
      default:
        utils.logger.warn(error, 'Error validation bad request')
        return utils.ErrorMessage('Global error validation', error.name)    }
  })

export default app