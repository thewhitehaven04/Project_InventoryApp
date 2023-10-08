import { type Response, type NextFunction, type Request } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { checkSchema, validationResult } from 'express-validator'
import { uploadImage } from 'middleware/utils/fileUpload'
import type ViewResponse from '@controllers/types/ViewResponse'
import {
  type IFigurineReadView,
  type IFigurineListView,
  type IFigurineUpdateRequestModel,
  type IFigurineUpdateView
} from './types'
import FIGURINE_UPDATE_VALIDATOR from '@models/figurine/validation'
import * as FigurineRepository from '@repository/item'
import { getAllAgeCategories } from '@repository/ageCategory'
import { getAllCategories } from '@repository/category'

const getAllItems = expressAsyncHandler(
  async (req: Request, res: ViewResponse<IFigurineListView>) => {
    const figurines = await FigurineRepository.getAllPopulatedFigurines()
    res.render('figurine_list', {
      title: 'All figurines',
      items: figurines.map((fig) => {
        return {
          name: fig.name,
          age: fig.age.name,
          price: fig.price,
          category: fig.category.name,
          imageUrl: fig.imageUrl,
          url: fig.get('url')
        }
      })
    })
  }
)

const getItemDetails = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<IFigurineReadView>,
    next: NextFunction
  ) => {
    const figurineOrNull = await FigurineRepository.getPopulatedFigurine(
      req.params.id,
      next
    )
    if (figurineOrNull !== null) {
      res.render('figurine_detail', {
        title: figurineOrNull.name,
        item: {
          ...figurineOrNull.toObject(),
          category: figurineOrNull.category.name,
          age: figurineOrNull.age.name
        }
      })
    }
  }
)

const getItemFormUpdate = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<IFigurineUpdateView>,
    next: NextFunction
  ) => {
    const figurineOrNull = await FigurineRepository.getPopulatedFigurine(
      req.params.id,
      next
    )

    const [ageOptions, categoryOptions] = await Promise.all([
      getAllAgeCategories(),
      getAllCategories()
    ])

    if (figurineOrNull !== null) {
      res.render('figurine_form', {
        title: `Update figurine: ${figurineOrNull.name}`,
        item: {
          ...figurineOrNull.toObject(),
          category: figurineOrNull.category.name,
          age: figurineOrNull.age.name
        },
        ageOptions,
        categoryOptions
      })
    }
  }
)

const getItemFormCreate = expressAsyncHandler(
  async (req, res: ViewResponse<IFigurineUpdateView>) => {
    const [ageOptions, categoryOptions] = await Promise.all([
      getAllAgeCategories(),
      getAllCategories()
    ])
    res.render('figurine_form', {
      title: 'Create a new figurine item',
      item: null,
      ageOptions,
      categoryOptions
    })
  }
)

const postItemDelete = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: Response,
    next: NextFunction
  ) => {
    const figurineItemToDeleteOrNull = await FigurineRepository.getFigurine(
      req.params.id,
      next
    )
    if (figurineItemToDeleteOrNull !== null) {
      await figurineItemToDeleteOrNull.deleteOne()
      res.redirect('/item/all')
    }
  }
)

const postItemCreate = [
  uploadImage.single('imageUrl'),
  checkSchema(FIGURINE_UPDATE_VALIDATOR),
  expressAsyncHandler(
    async (
      req: Request<any, any, IFigurineUpdateRequestModel, any>,
      res: Response | ViewResponse<IFigurineUpdateView>
    ) => {
      const err = validationResult(req)

      if (!err.isEmpty()) {
        const [ageOptions, categoryOptions] = await Promise.all([
          getAllAgeCategories(),
          getAllCategories()
        ])
        res.render('figurine_form', {
          title: 'Create a new figurine item',
          item: req.body,
          errors: err.array(),
          ageOptions,
          categoryOptions
        })
        return
      }

      const figurine = await FigurineRepository.saveFigurine(req.body)
      res.redirect(`/item/${figurine.id}`)
    }
  )
]

const postItemUpdate = [
  uploadImage.single('imageUrl'),
  checkSchema(FIGURINE_UPDATE_VALIDATOR),
  expressAsyncHandler(
    async (
      req: Request<{ id: string }, any, IFigurineUpdateRequestModel, any>,
      res: Response | ViewResponse<IFigurineUpdateView>,
      next: NextFunction
    ) => {
      const err = validationResult(req)

      if (!err.isEmpty()) {
        const [ageOptions, categoryOptions] = await Promise.all([
          getAllAgeCategories(),
          getAllCategories()
        ])
        res.render('figurine_form', {
          title: 'Create a new figurine item',
          item: req.body,
          ageOptions,
          categoryOptions,
          errors: err.array()
        })
        return
      }

      await FigurineRepository.updateFigurine(req.params.id, req.body, next)
      res.redirect(`/item/${req.params.id}`)
    }
  )
]

export {
  getAllItems,
  getItemDetails,
  getItemFormUpdate,
  getItemFormCreate,
  postItemDelete,
  postItemCreate,
  postItemUpdate
}
