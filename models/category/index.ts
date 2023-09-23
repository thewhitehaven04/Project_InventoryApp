import { Schema, model } from 'mongoose'
import type ICategory from './types'

const CategorySchema = new Schema<ICategory>({
  name: { type: String, maxlength: 32, required: true },
  description: { type: String, required: true }
})

CategorySchema.virtual('url').get(function () {
  return `category/${this._id.toString()}`
})

const Category = model<ICategory>('category', CategorySchema)
export default Category
