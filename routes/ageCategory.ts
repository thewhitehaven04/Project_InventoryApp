import {
  getAgeCategoryCreate,
  getAgeCategoryDetail,
  getAgeCategoryList
} from '@controllers/ageCategory'
import { Router } from 'express'

const ageCategoryRouter = Router()

ageCategoryRouter.get('/all', getAgeCategoryList)
ageCategoryRouter.get('/new', getAgeCategoryCreate)
ageCategoryRouter.get('/:id', getAgeCategoryDetail)

export default ageCategoryRouter
