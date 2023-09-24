import {
  type DefaultSchemaKeys,
  type Schema
} from 'express-validator/src/middlewares/schema'

const CATEGORY_VALIDATOR: Schema<DefaultSchemaKeys> = {
  name: {
    trim: true,
    notEmpty: true,
    isAlphanumeric: true,
    errorMessage: 'Name must be a non-empty alphanumeric string'
  },
  description: {
    trim: true,
    notEmpty: true,
    isAlphanumeric: true,
    errorMessage: 'Description must be a non-empty alphanumeric string'
  }
}

export default CATEGORY_VALIDATOR
