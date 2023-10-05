import type ICategory from '@models/category/types'
import { type IFigurine } from '@models/figurine/types'

export interface ICategoryListView {
  categories: ICategory[]
}

export interface ICategoryReadView {
  category: ICategory
}

export interface ICategoryUpdateView {
  category: ICategory | null
}

export interface IListOfItemWithCategoryView {
  category: ICategory
  items: IFigurine[]
}
