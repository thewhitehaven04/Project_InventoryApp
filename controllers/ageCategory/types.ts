import type IAgeCategory from '@models/ageCategory/types'
import { type IFigurine } from '@models/figurine/types'

export interface IAgeCategoryReadView {
  ageCategory: IAgeCategory | null
}

export interface IAgeCategoryUpdateView {
  ageCategory: IAgeCategory
}

export interface IAgeCategoryListView {
  ageCategories: IAgeCategory[]
}

export interface IListOfItemWithAgeCategoryView extends IAgeCategoryReadView {
  items: IFigurine[]
}
