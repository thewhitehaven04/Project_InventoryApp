import type ICategory from '@models/category/types'
import CATEGORY_VALIDATOR from '@models/category/validation'
import Figurine from '@models/figurine'
import { type Request, type NextFunction, type Response } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import { checkSchema } from 'express-validator/src/middlewares/schema'
import type ViewResponse from '@controllers/types/ViewResponse'
import {
  type ICategoryUpdateView,
  type ICategoryListView,
  type ICategoryReadView,
  type IListOfItemWithCategoryView
} from './types'
import * as CategoryRepository from '@repository/category'

const getCategoryList = expressAsyncHandler(
  async (req: Request, res: ViewResponse<ICategoryListView>) => {
    const categoryNames = await CategoryRepository.getCategoryNames()

    res.render('category_list', {
      title: 'All categories',
      categories: categoryNames
    })
  }
)

const getCategoryDetail = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<ICategoryReadView>,
    next: NextFunction
  ) => {
    const category = await CategoryRepository.getCategory(req.params.id, next)

    if (category !== null) {
      res.render('category_detail', {
        title: `Category details: ${category?.name}`,
        category
      })
    }
  }
)

const getCategoryCreate = expressAsyncHandler(
  async (req: Request, res: ViewResponse<ICategoryUpdateView>) => {
    res.render('category_form', {
      title: 'Create new category',
      category: null,
      errors: []
    })
  }
)

const getCategoryUpdate = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, any, any>,
    res: ViewResponse<ICategoryUpdateView>,
    next: NextFunction
  ) => {
    const { id } = req.params
    const categoryToUpdate = await CategoryRepository.getCategory(id, next)

    if (categoryToUpdate !== null) {
      res.render('category_form', {
        title: 'Update category',
        category: categoryToUpdate,
        errors: []
      })
    }
  }
)

const postCategoryCreate = [
  checkSchema(CATEGORY_VALIDATOR),
  expressAsyncHandler(async (req: Request<any, any, ICategory, any>, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.render('category_update', {
        title: 'Create new category',
        category: req.body,
        errors: errors.array()
      })
      return
    }

    const newCategory = await CategoryRepository.saveCategory(req.body)
    res.redirect(`/category/${newCategory.id}`)
  })
]

const postCategoryUpdate = [
  checkSchema(CATEGORY_VALIDATOR),
  expressAsyncHandler(
    async (
      req: Request<{ id: string }, any, ICategory, any>,
      res: ViewResponse<ICategoryUpdateView>,
      next: NextFunction
    ) => {
      const err = validationResult(req)
      const oldCategory = await CategoryRepository.getCategory(
        req.params.id,
        next
      )

      if (!err.isEmpty() && oldCategory !== null) {
        res.render('category_form', {
          title: 'Update category',
          category: req.body,
          errors: err.array()
        })
        return
      }
      await CategoryRepository.updateCategory(req.params.id, req.body, next)
      res.redirect(`/category/${req.params.id}`)
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
      CategoryRepository.getCategory(req.params.id, next),
      Figurine.find({ category: req.params.id }).exec()
    ])
    if (categoryToDeleteOrNull != null) {
      res.render('category_delete', {
        title: `Delete category: ${categoryToDeleteOrNull?.name}`,
        category: categoryToDeleteOrNull,
        items: figurinesWithCategory
      })
    }
  }
)

const postCategoryDelete = expressAsyncHandler(
  async (
    req: Request<{ id: string }, any, ICategory, any>,
    res: Response,
    next: NextFunction
  ) => {
    await CategoryRepository.deleteCategory(req.params.id, next)
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
