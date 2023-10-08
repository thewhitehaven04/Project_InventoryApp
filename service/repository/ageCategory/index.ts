import AgeCategory from '@models/ageCategory'
import { type NextFunction } from 'express'
import { throwErrorIfNull } from '..'
import type IAgeCategory from '@models/ageCategory/types'
import { type Types, type Document } from 'mongoose'

export async function getAgeCategory (
  id: string,
  next: NextFunction
): Promise<
  | (Document<unknown, Record<string, unknown>, IAgeCategory> &
  IAgeCategory & { _id: Types.ObjectId })
  | null
  > {
  const ageCategory = await AgeCategory.findById(id).exec()
  throwErrorIfNull(ageCategory, `No age category found with id ${id}`, next)
  return ageCategory
}

export async function getAllAgeCategories (): Promise<
Array<
Document<unknown, Record<string, unknown>, { name: string }> &
IAgeCategory & { _id: Types.ObjectId }
>
> {
  return await AgeCategory.find({}).exec()
}

export async function saveAgeCategory (
  category: IAgeCategory
): Promise<Document<unknown, Record<string, unknown>, IAgeCategory>> {
  const newAgeCategory = new AgeCategory(category)
  await newAgeCategory.save()
  return newAgeCategory
}

export async function updateAgeCategory (
  id: string,
  category: IAgeCategory
): Promise<void> {
  await AgeCategory.findByIdAndUpdate(id, category)
}
