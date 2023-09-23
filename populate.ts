import mongoose from 'mongoose'
import type IAgeCategory from './models/ageCategory/types'
import type ICategory from './models/category/types'
import { type IFigurine } from './models/figurine/types'
import Category from './models/category'
import Figurine from './models/figurine'

const connString = process.env.CONN_STRING ?? 'something'
async function connectToDb (connString: string): Promise<void> {
  await mongoose.connect(connString).catch((err) => {
    console.error(err)
  })
}

export default async function populateDb (
  categories: ICategory[],
  ageCategories: IAgeCategory[],
  figurines: IFigurine[]
): Promise<void> {
  await connectToDb(connString)

  for (const category of categories) {
    const categoryModel = new Category(category)
    await categoryModel.save()
    console.log(categoryModel.toObject(), ' saved')
  }

  for (const ageCategory of ageCategories) {
    const ageCategoryModel = new Category(ageCategory)
    await ageCategoryModel.save()
    console.log(ageCategoryModel.toObject(), ' saved')
  }

  // for (const figurine of figurines) {
  //   const figurineModel = new Figurine(figurine)
  //   await figurineModel.save()
  // }
}
