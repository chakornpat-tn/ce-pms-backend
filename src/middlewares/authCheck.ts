import { NextFunction, Request, Response } from 'express'
import * as utils from '@/utils'

export const HelloMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  utils.logger.info('test middle ware')
  next()
}
