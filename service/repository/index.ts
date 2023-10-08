import ApplicationError from '@controllers/errors/applicationError'
import { ErrorCode } from '@controllers/errors/errorCodes'
import { type NextFunction } from 'express'
import { type Document } from 'mongoose'

export function throwErrorIfNull (
  document: Document<any, any, any> | null,
  msg: string,
  next: NextFunction
): void {
  if (document === null) {
    next(new ApplicationError(msg, ErrorCode.NOT_FOUND))
  }
}
