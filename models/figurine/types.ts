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
  imageUrl: string
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
}

export interface IFigurineListView {
  items: IFigurineMainView[]
}
