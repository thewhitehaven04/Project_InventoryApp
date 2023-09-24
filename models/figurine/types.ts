import { type ObjectId } from 'mongoose'

export interface IFigurine {
  name: string
  description: string
  age: ObjectId
  category: ObjectId
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
