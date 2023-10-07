import {
  type Schema,
  type DefaultSchemaKeys
} from 'express-validator/src/middlewares/schema'

const FIGURINE_UPDATE_VALIDATOR: Schema<DefaultSchemaKeys> = {
  name: {
    trim: true,
    isString: true,
    isLength: {
      options: {
        min: 3,
        max: 32
      },
      errorMessage: 'Name must be a string between 3 and 32 characters long'
    }
  },
  description: {
    trim: true,
    isString: true,
    isLength: {
      options: {
        min: 3,
        max: 512
      },
      errorMessage: 'Name must be a string between 3 and 512 characters long'
    }
  },
  'dimensions.height': {
    optional: true,
    isFloat: {
      options: {
        min: 0
      }
    },
    errorMessage: 'Height must be a non-negative number or null'
  },
  'dimensions.width': {
    optional: true,
    isFloat: {
      options: {
        min: 0
      }
    },
    errorMessage: 'Width must either be a non-negative number or null'
  },
  'dimensions.depth': {
    optional: true,
    isFloat: {
      options: {
        min: 0
      }
    },
    errorMessage: 'Depth must either be a non-negative number or null'
  },
  weight: {
    optional: true,
    isFloat: {
      options: {
        min: 0
      }
    }
  },
  manufacturer: {
    optional: true,
    isString: true,
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 64
      }
    },
    errorMessage:
      'Manufacturer must either be a string between 2 and 64 characters long, or null'
  },
  age: {
    optional: false,
    errorMessage: 'Age category is a required attribute'
  },
  category: {
    optional: false,
    errorMessage: 'Category is a required attribute'
  },
  itemCountLeft: {
    isInt: {
      options: {
        min: 0
      },
      errorMessage: 'Enter a non-negative number to the "Item count" field'
    }
  },
  imageUrl: {
    isEmpty: false,
    isString: true
  },
  price: {
    isFloat: {
      options: {
        min: 0
      },
      errorMessage: 'Price must be a non-negative floating point number'
    },
    toFloat: true
  }
}

export default FIGURINE_UPDATE_VALIDATOR
