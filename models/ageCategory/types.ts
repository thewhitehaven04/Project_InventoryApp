import { type IFigurine } from '@models/figurine/types'

export default interface IAgeCategory {
  name: string
  min: number | null
  max: number | null
}

export interface IAgeCategoryReadView {
  ageCategory: IAgeCategory | null
}

export interface IAgeCategoryListView {
  ageCategories: IAgeCategory[]
}

export interface IListOfItemWithAgeCategoryView extends IAgeCategoryReadView {
  items: IFigurine[]
}
