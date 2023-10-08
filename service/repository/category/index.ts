import Category from '@models/category'
import { type NextFunction } from 'express'
import type ICategory from '@models/category/types'
import { throwErrorIfNull } from '..'
import { type Document, type Types } from 'mongoose'

export async function getCategory (
  id: string,
  next: NextFunction
): Promise<
  | (Document<unknown, Record<string, unknown>, ICategory> &
  ICategory & { _id: Types.ObjectId })
  | null
  > {
  const category = await Category.findById(id).exec()
  throwErrorIfNull(category, `No category with id ${id} found`, next)
  return category
}

export async function getCategoryNames (): Promise<
Array<
Document<unknown, Record<string, unknown>, { name: string }> &
ICategory & { _id: Types.ObjectId }
>
> {
  return await Category.find({}, 'name').exec()
}

export async function saveCategory (
  category: ICategory
): Promise<Document<unknown, Record<string, unknown>, ICategory>> {
  const newCategory = new Category(category)
  await newCategory.save()
  return newCategory
}

export async function updateCategory (
  id: string,
  category: ICategory,
  next: NextFunction
): Promise<void> {
  await Category.findByIdAndUpdate(id, category)
}

export async function deleteCategory (
  id: string,
  next: NextFunction
): Promise<void> {
  const category = await getCategory(id, next)
  if (category !== null) await category.deleteOne()
}
