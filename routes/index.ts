import express, {
  type Response,
  type NextFunction,
  type Request
} from 'express'
const router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.redirect('/category/all')
})

export default router
