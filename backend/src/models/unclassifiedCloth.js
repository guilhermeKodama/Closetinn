import validator from 'validator'
import mongoose from '/src/db/mongoose'

var UnclassifiedClothSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  productName: {
    type: String,
    required: true,
    minlength: 1,
  },
  description: {
    type: String
  },
  categoriesOrigin: [{
    type: String,
    required: true,
    minlength: 1,
  }],
  categories: [{
    type: String,
    required: true,
    minlength: 1,
  }],
  price: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    minlength: 1,
  },
  sizes: [{
    type: String,
    minlength: 1,
  }],
  url: {
    type: String,
    required: true,
    validate: {
      isAsync: true,
      validator: validator.isURL,
      message: '{VALUE} is not a valid url'
    }
  },
  image_medium_url: {
    type: String,
    required: true,
    validate: {
      isAsync: true,
      validator: validator.isURL,
      message: '{VALUE} is not a valid url'
    }
  },
  images_urls: [{
    type: String,
    validate: {
      isAsync: true,
      validator: validator.isURL,
      message: '{VALUE} is not a valid url'
    }
  }],
  disabled: {
    type: Boolean,
    default: false
  },
  site: {
    type: String,
    required: true,
    minlength: 1,
  },
  trackingUrl: {
    type: String,
    validate: {
      isAsync: true,
      validator: validator.isURL,
      message: '{VALUE} is not a valid url'
    }
  }
}, {
  timestamps: true
})

const UnclassifiedCloth = mongoose.model('UnclassifiedCloth', UnclassifiedClothSchema, 'unclassifiedClothes')

module.exports = UnclassifiedCloth
