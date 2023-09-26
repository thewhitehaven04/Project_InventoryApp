import {
  type DefaultSchemaKeys,
  type Schema
} from 'express-validator/src/middlewares/schema'

const CATEGORY_VALIDATOR: Schema<DefaultSchemaKeys> = {
  name: {
    trim: true,
    notEmpty: true,
    errorMessage: 'Category name must be a non-empty string'
  },
  description: {
    trim: true,
    notEmpty: true,
    errorMessage: 'Category description must be a non-empty string'
  }
}

export default CATEGORY_VALIDATOR
