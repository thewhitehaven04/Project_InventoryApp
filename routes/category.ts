import {
  createCategory,
  getCategoryCreate,
  getCategoryDetail,
  getCategoryList,
  getCategoryUpdate,
  updateCategory
} from '@controllers/category'
import { Router } from 'express'

const categoryRouter = Router()

categoryRouter.get('/all', getCategoryList)
categoryRouter.get('/:id', getCategoryDetail)
categoryRouter.get('/new', getCategoryCreate)
categoryRouter.get('/:id/update', getCategoryUpdate)
categoryRouter.post('/:id/update', ...updateCategory)
categoryRouter.post('/new', ...createCategory)

export default categoryRouter
