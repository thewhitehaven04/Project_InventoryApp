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
