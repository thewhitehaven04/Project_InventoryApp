import createError from 'http-errors'
import express, {
  type NextFunction,
  type Request,
  type Response
} from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import indexRouter from '@routes/index'
import dotenv from 'dotenv'
import categoryRouter from '@routes/category'
import { errorHandler, requestLogger } from 'utils/debug'
import helmet from 'helmet'
import mongoose from 'mongoose'
import ageCategoryRouter from '@routes/ageCategory'
import { itemRouter } from '@routes/items'

dotenv.config()

const app = express()

mongoose.connect(process.env.CONN_STRING ?? '').catch((err: any) => {
  console.error(err)
})

// setting up views
app.set('views', path.join(__dirname, '../', 'views'))
app.set('view engine', 'pug')

// setting up middleware
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(requestLogger)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ["'self'", 'cdn.jsdelivr.net']
    }
  })
)

// setting up controllers
app.use('/', indexRouter)
app.use('/category/', categoryRouter)
app.use('/ageCategory/', ageCategoryRouter)
app.use('/items', itemRouter)

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404))
})

app.use(errorHandler)

app.listen(process.env.PORT)
