import { getAllItems } from '@controllers/item'
import { Router } from 'express'

const itemRouter = Router()

itemRouter.get('/all', getAllItems)

export { itemRouter }
