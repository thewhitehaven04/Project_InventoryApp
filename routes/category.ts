import {
  getCategoryCreate,
  getCategoryDelete,
  getCategoryDetail,
  getCategoryList,
  getCategoryUpdate,
  postCategoryCreate,
  postCategoryDelete,
  postCategoryUpdate
} from '@controllers/category'
import { Router } from 'express'

const categoryRouter = Router()

categoryRouter.get('/all', getCategoryList)
categoryRouter.get('/new', getCategoryCreate)
categoryRouter.get('/:id', getCategoryDetail)
categoryRouter.get('/:id/update', getCategoryUpdate)
categoryRouter.get('/:id/delete', getCategoryDelete)
categoryRouter.post('/new', ...postCategoryCreate)
categoryRouter.post('/:id/update', ...postCategoryUpdate)
categoryRouter.post('/:id/delete', postCategoryDelete)

export default categoryRouter
