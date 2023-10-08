import Figurine from '@models/figurine'
import { type NextFunction } from 'express'
import { throwErrorIfNull } from '..'
import { type Types, type Document } from 'mongoose'
import { type IFigurine } from '@models/figurine/types'
import type IAgeCategory from '@models/ageCategory/types'
import type ICategory from '@models/category/types'
import { type IFigurineUpdateRequestModel } from '@controllers/item/types'

export async function getFigurine (
  id: string,
  next: NextFunction
): Promise<
  | (Document<unknown, Record<string, unknown>, IFigurine> &
  IFigurine & { _id: Types.ObjectId })
  | null
  > {
  const figurine = await Figurine.findById(id).exec()
  throwErrorIfNull(figurine, `No figurine with id ${id} found`, next)
  return figurine
}

export async function getPopulatedFigurine (
  id: string,
  next: NextFunction
): Promise<
  | (Document<unknown, Record<string, unknown>, IFigurine> &
  IFigurine & { _id: Types.ObjectId })
  | null
  > {
  const figurine = await Figurine.findById(id)
    .populate<{ age: IAgeCategory }>('age')
    .populate<{ category: ICategory }>('category')
    .exec()
  throwErrorIfNull(figurine, `No figurine with id ${id} found`, next)
  return figurine
}

export async function getAllPopulatedFigurines (): Promise<
Array<
Document<unknown, Record<string, unknown>, { name: string }> &
IFigurine & { _id: Types.ObjectId }
>
> {
  return await Figurine.find({})
    .populate<{ age: IAgeCategory }>('age')
    .populate<{ category: ICategory }>('category')
    .exec()
}

export async function saveFigurine (
  figurine: IFigurineUpdateRequestModel
): Promise<Document<unknown, Record<string, unknown>, IFigurine>> {
  const newCategory = new Figurine(figurine)
  await newCategory.save()
  return newCategory
}

export async function updateFigurine (
  id: string,
  figurine: IFigurineUpdateRequestModel,
  next: NextFunction
): Promise<void> {
  const oldFigurine = await getFigurine(id, next)
  if (oldFigurine !== null) {
    await oldFigurine
      .updateOne({
        ...figurine,
        imageUrl: oldFigurine.imageUrl ?? figurine.imageUrl
      })
      .exec()
  }
}
