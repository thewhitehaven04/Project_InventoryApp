import { Schema, model } from 'mongoose'
import type IAgeCategory from './types'

const AgeCategorySchema = new Schema<IAgeCategory>({
  name: String,
  min: { type: Number, min: 0, required: false },
  max: { type: Number, required: false }
})

AgeCategorySchema.virtual('url').get(function () {
  return `/ageCategory/${this._id.toString()}`
})

const AgeCategory = model<IAgeCategory>('age_category', AgeCategorySchema)
export default AgeCategory
