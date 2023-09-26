import { type IFigurine } from '@models/figurine/types'

export default interface ICategory {
  name: string | null
  description: string | null
  url?: string
}
export interface ICategoryListView {
  categories: ICategory[]
}

export interface ICategoryView {
  category: ICategory
}

export interface IListOfItemWithCategoryView {
  category: ICategory
  items: IFigurine[]
}
