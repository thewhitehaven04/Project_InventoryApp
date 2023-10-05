import {
  getAllItems,
  getItemDetails,
  getItemFormCreate,
  getItemFormUpdate,
  postItemCreate,
  postItemDelete,
  postItemUpdate
} from '@controllers/item/index'
import { Router } from 'express'

const itemRouter = Router()

itemRouter.get('/all', getAllItems)
itemRouter.get('/new', getItemFormCreate)
itemRouter.get('/:id', getItemDetails)
itemRouter.get('/:id/update', getItemFormUpdate)
itemRouter.post('/:id/delete', postItemDelete)
itemRouter.post('/:id/update', ...postItemUpdate)
itemRouter.post('/new', ...postItemCreate)

export { itemRouter }
