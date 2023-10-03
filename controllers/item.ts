import AgeCategory from '@models/ageCategory'
import Category from '@models/category'
import Figurine from '@models/figurine'
import {
  type IFigurineReadView,
  type IFigurineListView,
  type IFigurineUpdateView,
  type IFigurine
} from '@models/figurine/types'
import FIGURINE_VALIDATOR from '@models/figurine/validation'
import { type Response, type NextFunction, type Request } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { checkSchema, validationResult } from 'express-validator'
import type ViewResponse from 'types/ViewResponse'

const getAllItems = expressAsyncHandler(
  async (req: Request, res: ViewResponse<IFigurineListView>) => {
    const figurines = await Figurine.find({})
      .populate<{ age: { name: string } }>('age')
      .populate<{ category: { name: string } }>('category')
      .exec()

    res.render('figurine_list', {
      title: 'All figurines',
      items: figurines.map((fig) => {
        return {
          name: fig.name,
          age: fig.age.name,
          price: fig.price,
          category: fig.category.name,
          imageUrl: fig.imageUrl ?? '',
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
    const { id } = req.params
    const figurineOrNull = await Figurine.findById(id).exec()

    if (figurineOrNull === null) {
      const err: any = new Error(`There is no figurine with id ${id}`)
      err.status = 404
      next(err)
      return
    }

    res.render('figurine_detail', {
      title: figurineOrNull.name,
      item: figurineOrNull
    })
  }
)

const getItemFormUpdate = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<IFigurineUpdateView>,
    next: NextFunction
  ) => {
    const { id } = req.params
    const figurineOrNull = await Figurine.findById(id).exec()

    if (figurineOrNull === null) {
      const err: any = new Error(`There is no figurine with id ${id}`)
      err.status = 404
      next(err)
      return err
    }

    const [ageOptions, categoryOptions] = await Promise.all([
      AgeCategory.find().exec(),
      Category.find().exec()
    ])

    res.render('figurine_form', {
      title: `Update figurine: ${figurineOrNull.name}`,
      item: figurineOrNull,
      ageOptions,
      categoryOptions
    })
  }
)

const getItemFormCreate = expressAsyncHandler(
  async (
    req: Request<any, any, any, any>,
    res: ViewResponse<IFigurineUpdateView>
  ) => {
    const [ageOptions, categoryOptions] = await Promise.all([
      AgeCategory.find().exec(),
      Category.find().exec()
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
    const figurineItemToDeleteOrNull = await Figurine.findById(
      req.params.id
    ).exec()

    if (figurineItemToDeleteOrNull === null) {
      const err: any = new Error(
        `There is no item with given id: ${req.params.id}`
      )
      err.status = 404
      next(err)
      return
    }

    await figurineItemToDeleteOrNull.deleteOne()
    res.redirect('item/all')
  }
)

const postItemCreate = [
  checkSchema(FIGURINE_VALIDATOR),
  expressAsyncHandler(
    async (
      req: Request<any, any, IFigurine, any>,
      res: Response | ViewResponse<IFigurineUpdateView>
    ) => {
      const err = validationResult(req)

      if (!err.isEmpty()) {
        const [ageOptions, categoryOptions] = await Promise.all([
          AgeCategory.find().exec(),
          Category.find().exec()
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

      const figurine = new Figurine(req.body)
      await figurine.save()

      res.redirect(`item/${figurine.id}`)
    }
  )
]

const postItemUpdate = [
  checkSchema(FIGURINE_VALIDATOR),
  expressAsyncHandler(
    async (
      req: Request<{ id: string }, any, IFigurine, any>,
      res: Response | ViewResponse<IFigurineUpdateView>,
      next: NextFunction
    ) => {
      const err = validationResult(req)

      if (!err.isEmpty()) {
        const [ageOptions, categoryOptions] = await Promise.all([
          AgeCategory.find().exec(),
          Category.find().exec()
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

      const figurineToUpdateOrNull = await Figurine.findById(
        req.params.id
      ).exec()

      if (figurineToUpdateOrNull === null) {
        const err: any = new Error(
          `There is no figurine with given id: ${req.params.id}`
        )
        err.status = 404
        next(err)
        return
      }

      await figurineToUpdateOrNull.updateOne(req.body).exec()
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
