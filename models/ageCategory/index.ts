import { Schema, model } from 'mongoose'
import type IAgeCategory from './types'

const AgeCategorySchema = new Schema<IAgeCategory>({
  name: String,
  min: { type: Number, min: 0, required: false },
  max: { type: Number, required: false }
})

const AgeCategory = model<IAgeCategory>('age_category', AgeCategorySchema)
export default AgeCategory
