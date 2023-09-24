import { type Response } from 'express'
import { type ValidationError } from 'express-validator'

interface ViewRenderOptions {
  title: string
  errors?: ValidationError[]
}

export default interface ViewResponse<T> extends Response {
  render: ((view: string, options?: ViewRenderOptions & T) => void) &
  ((
    view: string,
    options?: ViewRenderOptions & T,
    callback?: (err: Error, html: string) => void
  ) => void) &
  ((view: string, callback?: (err: Error, html: string) => void) => void)
}
