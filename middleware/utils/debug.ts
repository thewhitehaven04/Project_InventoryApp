import { type NextFunction, type Request, type Response } from 'express'

const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log('Body:\n', req.body)
  next()
}

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
}

export { requestLogger, errorHandler }
