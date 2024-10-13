import { decrypt } from '../jwt/jwt'
import * as  utils from '@/utils'

export const GetTokenData = async (bearerToken?: string): Promise<any | null> => {
  if (!bearerToken) {
    utils.logger.warn('Authorization header is missing or empty')
    return null
  }

  const [tokenType, token] = bearerToken.split(' ')

  if (!token || tokenType.toLowerCase() !== 'bearer') {
    utils.logger.warn('Invalid bearer token format')
    return null
  }

  try {
    return await decrypt(token)
  } catch (error) {
    utils.logger.warn(error as Error, 'Failed to decrypt token')
    return null
  }
}
