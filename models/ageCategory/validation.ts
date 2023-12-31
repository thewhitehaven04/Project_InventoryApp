import {
  type DefaultSchemaKeys,
  type Schema
} from 'express-validator/src/middlewares/schema'

const AGE_CATEGORY_VALIDATOR: Schema<DefaultSchemaKeys> = {
  name: {
    trim: true,
    notEmpty: true,
    isString: true,
    errorMessage: 'Name must be a non-empty string'
  },
  min: {
    optional: {
      options: {
        values: 'falsy'
      }
    },
    isInt: {
      options: {
        min: 0
      }
    },
    errorMessage: 'Minimal age must be a positive number'
  },
  max: {
    optional: {
      options: {
        values: 'falsy'
      }
    },
    isInt: {
      options: {
        min: 0
      }
    },
    errorMessage: 'Maximum age must be a positive number'
  }
}

export default AGE_CATEGORY_VALIDATOR
