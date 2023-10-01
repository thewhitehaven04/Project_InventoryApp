import {
  type Schema,
  type DefaultSchemaKeys
} from 'express-validator/src/middlewares/schema'

const FIGURINE_VALIDATOR: Schema<DefaultSchemaKeys> = {
  name: {
    trim: true,
    isString: true
  }
}

export default FIGURINE_VALIDATOR
