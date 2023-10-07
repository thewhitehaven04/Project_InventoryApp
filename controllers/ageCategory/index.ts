import AgeCategory from '@models/ageCategory'
import type IAgeCategory from '@models/ageCategory/types'
import {} from '@models/ageCategory/types'
import AGE_CATEGORY_VALIDATOR from '@models/ageCategory/validation'
import Figurine from '@models/figurine'
import { type NextFunction, type Request } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { checkSchema, validationResult } from 'express-validator'
import type ViewResponse from '@controllers/types/ViewResponse'
import {
  type IAgeCategoryListView,
  type IAgeCategoryReadView,
  type IAgeCategoryUpdateView,
  type IListOfItemWithAgeCategoryView
} from './types'
import ApplicationError from '@controllers/errors/applicationError'
import { ErrorCode } from '@controllers/errors/errorCodes'

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
    res: ViewResponse<IAgeCategoryReadView>,
    next: NextFunction
  ) => {
    const ageCategoryOrNull = await AgeCategory.findById(req.params.id).exec()

    if (ageCategoryOrNull === null) {
      next(
        new ApplicationError(
          'There is no such category of age',
          ErrorCode.NOT_FOUND
        )
      )
      return
    }

    res.render('age_category_detail', {
      title: 'Age category details',
      ageCategory: ageCategoryOrNull
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
      res: ViewResponse<IAgeCategoryListView | IAgeCategoryUpdateView>
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

      res.redirect('/ageCategory/all')
    }
  )
]

const postAgeCategoryUpdate = [
  checkSchema(AGE_CATEGORY_VALIDATOR),
  expressAsyncHandler(
    async (
      req: Request<{ id: string }, any, IAgeCategory, any>,
      res: ViewResponse<IAgeCategoryReadView | IAgeCategoryUpdateView>,
      next: NextFunction
    ) => {
      const err = validationResult(req)
      const oldAgeCategoryOrNull = await AgeCategory.findById(
        req.params.id
      ).exec()

      if (oldAgeCategoryOrNull === null) {
        next(
          new ApplicationError(
            "The age category you're attempting to update does not exist",
            ErrorCode.NOT_FOUND
          )
        )
        return
      }

      if (!err.isEmpty()) {
        res.render('age_category_form', {
          title: 'Update age category',
          ageCategory: oldAgeCategoryOrNull,
          errors: err.array()
        })
      }

      await AgeCategory.findByIdAndUpdate(req.params.id, {
        ...req.body,
        _id: req.params.id
      }).exec()

      res.redirect(`/ageCategory/${req.params.id}`)
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
      next(
        new ApplicationError(
          "The age category you're attempting to delete does not exist",
          ErrorCode.NOT_FOUND
        )
      )
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
      next(
        new ApplicationError(
          'There is no such age category',
          ErrorCode.NOT_FOUND
        )
      )
      return
    }

    res.render('age_category_delete', {
      title: 'Delete age category',
      ageCategory: ageCategoryToDeleteOrNull,
      items: itemsForThisAgeCategory
    })
  }
)

const getAgeCategoryUpdate = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<IAgeCategoryReadView>,
    next: NextFunction
  ) => {
    const ageCategoryToUpdateOrNull = await AgeCategory.findById(
      req.params.id
    ).exec()

    if (ageCategoryToUpdateOrNull === null) {
      next(
        new ApplicationError(
          "The age category you're attempting to update does not exist",
          ErrorCode.NOT_FOUND
        )
      )
      return
    }

    res.render('age_category_form', {
      title: `Update age category: ${ageCategoryToUpdateOrNull?.name}`,
      ageCategory: ageCategoryToUpdateOrNull
    })
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
