import { NextFunction, Request, Response } from 'express'

export const HelloMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Hello Middleware')
  next()
}
