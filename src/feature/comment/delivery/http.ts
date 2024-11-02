import Elysia, { t } from 'elysia'
import bearer from '@elysiajs/bearer'
import { Comment } from '@prisma/client'
import { CommentUsecase } from '../usercase/commentUsecase'
import * as middleWare from '@/middleware'
import * as utils from '@/utils'
import { UpdateCommentsRequest } from '@/models/Comment'

const title = 'Comment Controller V1'
const commentUsecase = CommentUsecase
const commentSwaggerDetail = (summary: string, detail: string) => {
  return {
    tags: ['Comment'],
    summary: summary,
    detail: detail,
  }
}

export const CommentDelivery = new Elysia({ prefix: '/comment' })
  .use(middleWare.JwtConfig)
  .use(bearer())
  .guard({
    beforeHandle: middleWare.checkAuthorization,
  })
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const req = body as Comment[]
        await commentUsecase.CreateComment(req)
        return utils.SuccessMessage(title, 'create project status success.')
      } catch (error) {
        utils.logger.warn(error, 'Create Comment Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'create comment error.')
      }
    },
    {
      body: t.Array(
        t.Object({
          content: t.String(),
          projectDocumentId: t.Number(),
        })
      ),
      detail: commentSwaggerDetail(
        'Create Comment',
        'Create a new comment for project document'
      ),
    }
  )
  .get(
    '/:id',
    async ({ params, set }) => {
      try {
        const id = Number(params.id)
        const comment = await commentUsecase.GetCommentByID(id)
        return utils.SuccessMessage(
          title,
          'get comment by id success.',
          comment
        )
      } catch (error) {
        utils.logger.warn(error, 'Get Comment By ID Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'get comment by id error.')
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      detail: commentSwaggerDetail('Delete Comment', 'Delete a comment by id'),
    }
  )
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const { projectDocumentId, projectDocumentEditId } = query
        const comments = await commentUsecase.ListComment(
          projectDocumentId ? Number(projectDocumentId) : undefined,
          projectDocumentEditId ? Number(projectDocumentEditId) : undefined
        )
        return utils.SuccessMessage(title, 'list comments success.', comments)
      } catch (error) {
        utils.logger.warn(error, 'List Comments Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'list comments error.')
      }
    },
    {
      query: t.Object({
        projectDocumentId: t.Optional(t.Number()),
        projectDocumentEditId: t.Optional(t.Number()),
      }),
      detail: commentSwaggerDetail('List Comments', 'Get list of comments'),
    }
  )
  .put(
    '/',
    async ({ body, set }) => {
      try {
        const req = body as UpdateCommentsRequest
        await commentUsecase.UpdateComments(req)
        return utils.SuccessMessage(title, 'update comments success.')
      } catch (error) {
        utils.logger.warn(error, 'Update Comments Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'update comments error.')
      }
    },
    {
      body: t.Object({
        ids: t.Array(t.Number()),
        content: t.Optional(t.String()),
        projectDocumentEditId: t.Optional(t.Union([t.Number(), t.Null()])),
      }),
      detail: commentSwaggerDetail(
        'Update Comments',
        'Update multiple comments'
      ),
    }
  )
  .delete(
    '/:id',
    async ({ params, set }) => {
      try {
        const id = Number(params.id)
        await commentUsecase.DeleteComment(id)
        return utils.SuccessMessage(title, 'delete comment success.')
      } catch (error) {
        utils.logger.warn(error, 'Delete Comment Controller Error')
        set.status = 500
        return utils.ErrorMessage(title, 'delete comment error.')
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      detail: commentSwaggerDetail('Delete Comment', 'Delete a comment by id'),
    }
  )
