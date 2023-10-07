import { type ErrorCode } from './errorCodes'

class ApplicationError extends Error {
  statusCode: ErrorCode

  constructor (message: string, errorCode: ErrorCode) {
    super(message)
    this.statusCode = errorCode
  }
}

export default ApplicationError
