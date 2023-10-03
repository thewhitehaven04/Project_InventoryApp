import type IAgeCategory from '@models/ageCategory/types'
import type ICategory from '@models/category/types'

export interface IFigurine {
  name: string
  description: string
  age: IAgeCategory
  category: ICategory
  manufacturer?: string
  dimensions: {
    height?: number
    width?: number
    depth?: number
  }
  weight?: number
  price: number
  itemCountLeft: number
  // temporary change, remove nullable imageUrl
  // once uploading images to web server is figured out
  imageUrl: string | null
}

export interface IFigurineMainView {
  name: string
  age: string
  category: string
  price: number
  imageUrl: string
  url: string
}

export interface IFigurineReadView {
  item: IFigurine
}

export interface IFigurineUpdateView {
  item: IFigurine | null
  ageOptions: IAgeCategory[]
  categoryOptions: ICategory[]
}

export interface IFigurineListView {
  items: IFigurineMainView[]
}
