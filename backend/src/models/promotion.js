import validator from 'validator'
import Cloth from '/src/models/cloth'
import mongoosastic from 'mongoosastic'
import mongoose from '/src/db/mongoose'
import elasticsearch from '../db/elasticsearch'
import Promise from 'bluebird'

var PromotionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  clothes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cloth' }],
  biggestDiscount: {
    type: Number,
    required: true,
  },
  biggestDiscountCloth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cloth'
  },
  lowestPrice: {
    type: Number,
    required: true,
  },
  lowestPriceCloth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cloth'
  }
}, {
  timestamps: true
})

PromotionSchema.statics.getFilters = async (promotion) => {
  //TODO TEMPORARY
  const filterMissingData = { sizes: { $nin:[''] }, 'sizes.0': { $exists: true } }
  const filters = []

  const brands = await Cloth.distinct('brand', { _id: { $in: promotion.clothes } })
  const sizes = await Cloth.distinct('sizes', { _id: { $in: promotion.clothes } })
  const sites = await Cloth.distinct('site', { _id: { $in: promotion.clothes } })
  const priceRange = await Cloth
  .aggregate([
    { $match: { _id: { $in: promotion.clothes }, sizes: filterMissingData.sizes, 'sizes.0': filterMissingData['sizes.0'] } },
    { $group: { _id: null, maxPrice: { $max: '$price' }, minPrice: { $min: '$price' }}},
    { $project: { _id: 0, maxPrice: 1, minPrice: 1 }}
  ])

  filters.push({
    filter: 'brands',
    name: 'Marcas',
    options: brands.sort(),
    type: 'checkbox'
  })

  filters.push({
    filter: 'sites',
    name: 'Sites',
    options: sites.sort(),
    type: 'checkbox'
  })

  filters.push({
    filter: 'sizes',
    name: 'Tamanho',
    options: sizes.sort(),
    type: 'checkbox'
  })

  if(priceRange && priceRange.length === 1) {
    filters.push({
      name: 'Preços',
      filter: 'price',
      type: 'range',
      min: priceRange[0].minPrice,
      max: priceRange[0].maxPrice
    })
  }

  return filters
}

const Promotion = mongoose.model('Promotion', PromotionSchema, 'promotions')

module.exports = Promotion
