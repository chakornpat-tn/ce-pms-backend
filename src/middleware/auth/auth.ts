import { Elysia, Context } from 'elysia'
import * as utils from '@/utils'

export const checkAuthorization = async ({
  set,
  jwt,
  bearer,
}: Context & { jwt: any; bearer: any }) => {
  if (!bearer || !jwt) {
    set.status = 401
    return utils.ErrorMessage('Authorization', 'unauthorized.')
  }

  const payload = await jwt.verify(bearer)
  if (!payload) {
    set.status = 401
    return utils.ErrorMessage('Authorization', 'unauthorized.')
  }
}