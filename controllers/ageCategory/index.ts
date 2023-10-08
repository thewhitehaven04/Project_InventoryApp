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
import * as AgeCategoryRepository from '@repository/ageCategory'

const getAgeCategoryList = expressAsyncHandler(
  async (req: Request, res: ViewResponse<IAgeCategoryListView>) => {
    const ageCategoryList = await AgeCategoryRepository.getAllAgeCategories()

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
    const { id } = req.params

    const ageCategoryOrNull = await AgeCategoryRepository.getAgeCategory(
      id,
      next
    )
    if (ageCategoryOrNull !== null) {
      res.render('age_category_detail', {
        title: 'Age category details',
        ageCategory: ageCategoryOrNull
      })
    }
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
          ageCategory: req.body,
          errors: err.array()
        })
        return
      }

      await AgeCategoryRepository.saveAgeCategory(req.body)
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
      const oldAgeCategoryOrNull = await AgeCategoryRepository.getAgeCategory(
        req.params.id,
        next
      )

      if (!err.isEmpty() && oldAgeCategoryOrNull !== null) {
        res.render('age_category_form', {
          title: 'Update age category',
          ageCategory: req.body,
          errors: err.array()
        })
      }
      await AgeCategoryRepository.updateAgeCategory(req.params.id, req.body)
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
    const ageCategoryToDeleteOrNull =
      await AgeCategoryRepository.getAgeCategory(req.params.id, next)
    if (ageCategoryToDeleteOrNull !== null) {
      await ageCategoryToDeleteOrNull.deleteOne()
      res.redirect('/ageCategory/all')
    }
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
        AgeCategoryRepository.getAgeCategory(req.params.id, next),
        Figurine.find({ age: req.params.id }).exec()
      ])

    if (ageCategoryToDeleteOrNull !== null) {
      res.render('age_category_delete', {
        title: 'Delete age category',
        ageCategory: ageCategoryToDeleteOrNull,
        items: itemsForThisAgeCategory
      })
    }
  }
)

const getAgeCategoryUpdate = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<IAgeCategoryReadView>,
    next: NextFunction
  ) => {
    const ageCategoryToUpdateOrNull =
      await AgeCategoryRepository.getAgeCategory(req.params.id, next)

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
