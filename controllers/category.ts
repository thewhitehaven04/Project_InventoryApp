import Category from '@models/category'
import type ICategory from '@models/category/types'
import {
  type ICategoryView,
  type ICategoryListView,
  type IListOfItemWithCategoryView
} from '@models/category/types'
import CATEGORY_VALIDATOR from '@models/category/validation'
import Figurine from '@models/figurine'
import { type Request, type NextFunction, type Response } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import { checkSchema } from 'express-validator/src/middlewares/schema'
import type ViewResponse from 'types/ViewResponse'

const getCategoryList = expressAsyncHandler(
  async (req: Request, res: ViewResponse<ICategoryListView>) => {
    const categories = await Category.find({}, 'name').exec()

    res.render('categories_list', {
      title: 'All categories',
      categories
    })
  }
)

const getCategoryDetail = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<ICategoryView>,
    next: NextFunction
  ) => {
    const category = await Category.findById(req.params.id).exec()

    if (category === null) {
      const err: any = new Error('No such category found')
      err.status = 404
      next(err)
    }

    res.render('category_detail', {
      title: `Category details: ${category?.name}`,
      category: {
        name: category?.name ?? null,
        description: category?.description ?? null,
        url: category?.url
      }
    })
  }
)

const getCategoryCreate = expressAsyncHandler(
  async (req: Request, res: ViewResponse<ICategoryView>) => {
    res.render('category_form', {
      title: 'Create new category',
      category: { name: null, description: null }
    })
  }
)

const getCategoryUpdate = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<ICategoryView>,
    next: NextFunction
  ) => {
    const categoryToUpdate = await Category.findById(req.params.id).exec()

    if (categoryToUpdate === null) {
      const err: any = new Error(
        'There is no category with the supplied id: ' + req.params.id
      )
      err.status = 404
      next(err)
    }

    res.render('category_form', {
      title: 'Update category',
      category: {
        name: categoryToUpdate?.name ?? null,
        description: categoryToUpdate?.description ?? null
      },
      errors: []
    })
  }
)

const postCategoryCreate = [
  checkSchema(CATEGORY_VALIDATOR),
  expressAsyncHandler(
    async (
      req: Request<any, any, ICategory, any>,
      res: ViewResponse<ICategoryView>
    ) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        res.render('category_update', {
          title: 'Create new category',
          category: { name: req.body.name, description: req.body.description },
          errors: errors.array()
        })
        return
      }

      const newCategory = new Category({
        name: req.body.name,
        description: req.body.description
      })
      await newCategory.save()
      res.redirect(`/category/${newCategory.id}/details`)
    }
  )
]

const postCategoryUpdate = [
  checkSchema(CATEGORY_VALIDATOR),
  expressAsyncHandler(
    async (
      req: Request<{ id: string }, any, ICategory, any>,
      res: ViewResponse<ICategoryView>,
      next: NextFunction
    ) => {
      const err = validationResult(req)
      const oldCategory = await Category.findById(req.params.id).exec()

      if (oldCategory === null) {
        const error: any = new Error(
          'The category being updated does not exist'
        )
        error.status = 404
        next(error)
      }

      if (!err.isEmpty()) {
        res.render('category_form', {
          title: `Update category: ${oldCategory?.name}`,
          category: { name: req.body.name, description: req.body.description },
          errors: err.array()
        })
        return
      }
      await Category.findByIdAndUpdate(req.params.id, {
        ...req.body,
        _id: req.params.id
      })
      res.redirect(`/category/${req.params.id}/details`)
    }
  )
]

const getCategoryDelete = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<IListOfItemWithCategoryView>,
    next: NextFunction
  ) => {
    const [categoryToDeleteOrNull, figurinesWithCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Figurine.find({ category: req.params.id }).exec()
    ])

    if (categoryToDeleteOrNull === null) {
      const err: any = new Error(
        "The category you're attempting to delete does not exist"
      )
      err.status = 404
      next(err)
      return
    }

    res.render('category_delete', {
      title: `Delete category: ${categoryToDeleteOrNull?.name}`,
      category: categoryToDeleteOrNull,
      items: figurinesWithCategory
    })
  }
)

const postCategoryDelete = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, ICategory, any>,
    res: Response,
    next: NextFunction
  ) => {
    const existingCategoryOrNull = await Category.findById(req.params.id)

    if (existingCategoryOrNull === null) {
      const err: any = new Error(
        "The category you're attempting to delete does not exist"
      )
      err.status = 404
      next(err)
      return
    }
    await existingCategoryOrNull.deleteOne()
    res.redirect('/category/all')
  }
)

export {
  getCategoryList,
  getCategoryDetail,
  getCategoryCreate,
  getCategoryUpdate,
  getCategoryDelete,
  postCategoryCreate,
  postCategoryUpdate,
  postCategoryDelete
}
