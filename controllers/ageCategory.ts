import AgeCategory from '@models/ageCategory'
import type IAgeCategory from '@models/ageCategory/types'
import {
  type IAgeCategoryReadView,
  type IAgeCategoryListView,
  type IListOfItemWithAgeCategoryView
} from '@models/ageCategory/types'
import AGE_CATEGORY_VALIDATOR from '@models/ageCategory/validation'
import Figurine from '@models/figurine'
import { type NextFunction, type Request } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { checkSchema, validationResult } from 'express-validator'
import type ViewResponse from 'types/ViewResponse'

const getAgeCategoryList = expressAsyncHandler(
  async (req: Request, res: ViewResponse<IAgeCategoryListView>) => {
    const ageCategoryList = await AgeCategory.find().exec()

    res.render('age_category_list', {
      title: 'Age categories',
      ageCategories: ageCategoryList
    })
  }
)

const getAgeCategoryDetail = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<IAgeCategoryReadView>
  ) => {
    const ageCategoryOrNull = await AgeCategory.findById(req.params.id).exec()

    if (ageCategoryOrNull === null) {
      const err: any = new Error('There is no such category of age')
      err.status = 404
      return err
    }

    res.render('age_category_detail', {
      title: `Age category details: ${ageCategoryOrNull?.name}`,
      ageCategory: {
        name: ageCategoryOrNull.name,
        min: ageCategoryOrNull.min,
        max: ageCategoryOrNull.max
      }
    })
  }
)

const getAgeCategoryCreate = expressAsyncHandler(
  async (req: Request, res: ViewResponse<IAgeCategoryReadView>) => {
    res.render('age_category_form', {
      title: 'Create new age category',
      ageCategory: null
    })
  }
)

const postAgeCategoryCreate = [
  checkSchema(AGE_CATEGORY_VALIDATOR),
  expressAsyncHandler(
    async (
      req: Request<any, any, IAgeCategory, any>,
      res: ViewResponse<IAgeCategoryListView | IAgeCategoryReadView>
    ) => {
      const err = validationResult(req)

      if (!err.isEmpty()) {
        res.render('age_category_form', {
          title: 'Create new age category',
          ageCategory: {
            name: req.body.name,
            min: req.body.min,
            max: req.body.max
          },
          errors: err.array()
        })
        return
      }

      const ageCategory = new AgeCategory({
        name: req.body.name,
        min: req.body.min,
        max: req.body.max
      })
      await ageCategory.save()

      res.redirect(`/ageCategory/${req.params.id}/details`)
    }
  )
]

const postAgeCategoryUpdate = [
  checkSchema(AGE_CATEGORY_VALIDATOR),
  expressAsyncHandler(
    async (
      req: Request<{ id: string }, any, IAgeCategory, any>,
      res: ViewResponse<IAgeCategoryReadView | IAgeCategoryListView>,
      next: NextFunction
    ) => {
      const err = validationResult(req)
      const oldAgeCategoryOrNull = await AgeCategory.findById(
        req.params.id
      ).exec()

      if (oldAgeCategoryOrNull === null) {
        const error: any = new Error(
          "The age category you're attempting to update does not exist"
        )
        error.status = 404
        next(error)
      }

      if (!err.isEmpty()) {
        res.render('age_category_form', {
          title: 'Update age category',
          ageCategory: {
            name: req.body.name,
            min: req.body.min,
            max: req.body.max
          },
          errors: err.array()
        })
      }

      await AgeCategory.findByIdAndUpdate(req.params.id, {
        ...req.body,
        _id: req.params.id
      }).exec()

      res.redirect(`/ageCategory/${req.params.id}/details`)
    }
  )
]

const postAgeCategoryDelete = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<IAgeCategoryListView>,
    next: NextFunction
  ) => {
    const ageCategoryToDeleteOrNull = await AgeCategory.findById(
      req.params.id
    ).exec()

    if (ageCategoryToDeleteOrNull === null) {
      const err: any = new Error(
        "The age category you're attempting to delete does not exist"
      )
      err.status = 404
      next(err)
      return
    }

    await ageCategoryToDeleteOrNull.deleteOne()
    res.redirect('/ageCategory/all')
  }
)

const getAgeCategoryDelete = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<IListOfItemWithAgeCategoryView>,
    next: NextFunction
  ) => {
    const [ageCategoryToDeleteOrNull, itemsForThisAgeCategory] =
      await Promise.all([
        AgeCategory.findById(req.params.id).exec(),
        Figurine.find({ age: req.params.id }).exec()
      ])

    if (ageCategoryToDeleteOrNull === null) {
      const err: any = new Error('There is no such age category')
      err.status = 404
      next(err)
      return
    }

    res.render(
      'age_category_delete',
      {
        title: 'Deleting age category',
        ageCategory: {
          name: ageCategoryToDeleteOrNull.name,
          max: ageCategoryToDeleteOrNull.max,
          min: ageCategoryToDeleteOrNull.min
        },
        items: itemsForThisAgeCategory
      }
    )
  }
)

export {
  getAgeCategoryList,
  getAgeCategoryDetail,
  getAgeCategoryCreate,
  getAgeCategoryUpdate,
  getAgeCategoryDelete,
  postAgeCategoryCreate,
  postAgeCategoryUpdate,
  postAgeCategoryDelete
}
