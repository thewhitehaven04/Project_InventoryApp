import {
  getAgeCategoryCreate,
  getAgeCategoryDelete,
  getAgeCategoryDetail,
  getAgeCategoryList,
  getAgeCategoryUpdate,
  postAgeCategoryCreate,
  postAgeCategoryDelete,
  postAgeCategoryUpdate
} from '@controllers/ageCategory'
import { Router } from 'express'

const ageCategoryRouter = Router()

ageCategoryRouter.get('/all', getAgeCategoryList)
ageCategoryRouter.get('/new', getAgeCategoryCreate)
ageCategoryRouter.get('/:id', getAgeCategoryDetail)
ageCategoryRouter.get('/:id/update', getAgeCategoryUpdate)
ageCategoryRouter.get('/:id/delete', getAgeCategoryDelete)
ageCategoryRouter.post('/new', ...postAgeCategoryCreate)
ageCategoryRouter.post('/:id/update', ...postAgeCategoryUpdate)
ageCategoryRouter.post('/:id/delete', postAgeCategoryDelete)

export default ageCategoryRouter
