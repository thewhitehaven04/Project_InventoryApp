import mongoose, { Schema, model } from 'mongoose'
import { type IFigurine } from './types'

const FigurineSchema = new Schema<IFigurine>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  dimensions: {
    height: { type: Number, required: true },
    width: { type: Number, required: true },
    depth: { type: Number, required: true }
  },
  weight: Number,
  manufacturer: String,
  age: { type: mongoose.Types.ObjectId, ref: 'age_category', required: true },
  category: { type: mongoose.Types.ObjectId, ref: 'category', required: true },
  itemCountLeft: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true }
})

const Figurine = model<IFigurine>('figurine', FigurineSchema)
export default Figurine
