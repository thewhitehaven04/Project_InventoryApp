import AgeCategory from '@models/ageCategory'
import type IAgeCategory from '@models/ageCategory/types'
import {
  type IAgeCategoryReadView,
  type IAgeCategoryListView
} from '@models/ageCategory/types'
import { type Request } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import type ViewResponse from 'types/ViewResponse'

const getAgeCategoryList = expressAsyncHandler(
  async (req: Request, res: ViewResponse<IAgeCategoryListView>) => {
    const ageCategoryList = await AgeCategory.find()

    res.render('age_categories_list', {
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
    const ageCategoryOrNull = await AgeCategory.findById(req.params.id)

    if (ageCategoryOrNull === null) {
      const err: any = new Error('There is no such category of age')
      err.status = 404
      return err
    }

    res.render('age_category_detail', {
      title: `Age category details: ${ageCategoryOrNull?.name}`,
      ageCategory: {
        name: ageCategoryOrNull.name,
        min: ageCategoryOrNull.min ?? null,
        max: ageCategoryOrNull.max ?? null
      }
    })
  }
)

const getAgeCategoryCreate = expressAsyncHandler(
  async (req: Request, res: ViewResponse<IAgeCategoryReadView>) => {
    res.render('age_category_form', {
      title: 'Create new age category',
      ageCategory: { name: null, min: null, max: null }
    })
  }
)

const postAgeCategoryCreate = expressAsyncHandler(
  async (req: Request<any, any, IAgeCategory, any>) => {
    const err = validationResult(req)

    const ageCategory = new AgeCategory({
      name: req.body.name,
      min: req.body.min,
      max: req.body.max
    })
  }
)

export { getAgeCategoryList, getAgeCategoryDetail, getAgeCategoryCreate }
