import validator from 'validator'
import mongoosastic from 'mongoosastic'
import mongoose from '/src/db/mongoose'
import elasticsearch from '../db/elasticsearch'
import Promise from 'bluebird'

var ClothSchema = new mongoose.Schema({
  origin: {
    type: String,
    select: false
  },
  color: {
    type: String,
  },
  title: {
    type: String,
    minlength: 1,
  },
  productName: {
    type: String,
    required: true,
    minlength: 1,
    es_indexed: true
  },
  description: {
    type: String
  },
  categoriesOrigin: [{
    type: String,
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
  priceOld: {
    type: Number
  },
  priceDiscount: {
    type: Number
  },
  brand: {
    type: String,
  },
  gender: {
    type: String,
    required: true,
    minlength: 1,
  },
  sizes: [{
    type: String,
  }],
  url: {
    type: String,
    required: true,
    unique: true,
  },
  image_medium_url: {
    type: String,
  },
  images_urls: [{
    type: String,
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
  }
}, {
  timestamps: true
})

// ClothSchema.plugin(mongoosastic, {
//   esClient: elasticsearch,
//   bulk: {
//     size: 10,
//     delay: 100
//   },
//   filter: (doc) => {
//     return doc.gender === 'feminino' || doc.disabled || doc.trackingUrl === null
//   }
// })

ClothSchema.index({ productName: "text" })
ClothSchema.index({ url: 1 }, { background: true })
ClothSchema.index({ brand: 1 }, { background: true })
ClothSchema.index({ site: 1 }, { background: true })
ClothSchema.index({ price: 1 }, { background: true })
ClothSchema.index({ sizes: 1 }, { background: true })
ClothSchema.index({ gender: 1 }, { background: true })
ClothSchema.index({ categories: 1 }, { background: true })

const Cloth = mongoose.model('Cloth', ClothSchema, 'clothes')
// Cloth.search = Promise.promisify(Cloth.search, { context: Cloth })
//
// Cloth.synchronize()
// .on('close', () => {
//   console.log('Finished indexing the Cloth collection')
// })
// .on('error', (err) => {
//   console.error('The following error occurred during the indexing of the Cloth collection', err)
// })

module.exports = Cloth
