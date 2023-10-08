import type IAgeCategory from '@models/ageCategory/types'
import type ICategory from '@models/category/types'
import { type IFigurine } from '@models/figurine/types'
import { type UploadImageRequestBody } from '@models/requests/body/types'

export interface IFigurineUpdateRequestModel extends UploadImageRequestBody {
  name: string
  description: string
  age: string
  category: string
  manufacturer?: string
  dimensions: {
    height?: number
    width?: number
    depth?: number
  }
  weight?: number
  price: number
  itemCountLeft: number
}

export interface IFigurineMainView {
  name: string
  age: string
  category: string
  price: number
  imageUrl: string
  url: string
}

export interface IFigurineFullView extends Omit<IFigurine, 'age' | 'category'> {
  age: string
  category: string
}

export interface IFigurineReadView {
  item: IFigurineFullView
}

export interface IFigurineUpdateView {
  item: IFigurineFullView | null
  ageOptions: IAgeCategory[]
  categoryOptions: ICategory[]
}

export interface IFigurineListView {
  items: IFigurineMainView[]
}
