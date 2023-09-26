import mongoose, { Schema, model } from 'mongoose'
import { type IFigurine } from './types'

const FigurineSchema = new Schema<IFigurine>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  dimensions: {
    height: Number,
    width: Number,
    depth: Number
  },
  weight: Number,
  manufacturer: String,
  age: { type: mongoose.Types.ObjectId, ref: 'AgeCategory', required: true },
  category: { type: mongoose.Types.ObjectId, ref: 'Category', required: true },
  itemCountLeft: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true }
})

FigurineSchema.virtual('url').get(function () {
  return `/item/${this._id.toString()}`
})

const Figurine = model<IFigurine>('figurine', FigurineSchema)
export default Figurine
