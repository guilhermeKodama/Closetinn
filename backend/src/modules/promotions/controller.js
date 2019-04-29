import utils from '../clothes/utils'
import config from '/config'
import { ObjectID } from 'mongodb'
import Promotion from '/src/models/promotion'
import Cloth from '/src/models/cloth'

//TODO TEMPORARY
const filterMissingData = { sizes: { $nin:[''] }, 'sizes.0': { $exists: true } }
const filterWrongPromotions = { biggestDiscount: { $lte: 0.9 } }

module.exports = {
  /**
  @api {get} /promotion/:id Get promotion
  @apiVersion 0.0.1
  @apiName GetPromotion
  @apiGroup Promotions
  @apiDescription
  Get promotion
  **/
  getPromotion: async (req, res, next) => {
    try {
      const offset = parseInt(req.query.offset)
      const currentPage = parseInt(req.query.currentPage)
      const options = utils.transformQueryInMongoFilters(req.query)

      const promotion = await Promotion.findOne({ _id: new ObjectID(req.params.id) })
      .populate('biggestDiscountCloth')
      .populate('lowestPriceCloth')
      .exec()

      promotion.clothes = promotion.clothes.map((id) => new ObjectID(id) )

      const filters = await Promotion.getFilters(promotion)

      const constrains = [ {_id: { '$in': promotion.clothes} }, filterMissingData ]
      Object.keys(options).forEach((key) => {
        const data = {}
        data[key] = options[key]
        constrains.push(data)
      })

      promotion.clothes = await Cloth.find({ $and: constrains })
      .sort( { priceDiscount: -1 } )
      .skip(currentPage === 1? 0 : (currentPage - 1) * offset)
      .limit(offset)

      const count = await Cloth.count({ $and: constrains })
      const pages = count % offset > 0? parseInt(count / offset) + 1 : parseInt(count / offset)

      const pagination = {
        currentPage,
        offset,
        totalPages: parseInt(count / offset) < 1? 1 : pages,
        totalItems: count
      }

      res.json({ ...promotion.toJSON(), filters, pagination })
    } catch(e) {
      console.log('ERROR:', e)
      res.status(500).send({ error: e.toString() })
    }
  },
  /**
  @api {get} /promotions Get available promotions
  @apiVersion 0.0.1
  @apiName GetPromotions
  @apiGroup Promotions
  @apiDescription
  Get available promotions
  **/
  getPromotions: async (req, res, next) => {
    try {
      const offset = parseInt(req.query.offset)
      const currentPage = parseInt(req.query.currentPage)

      const promotions = await Promotion.find(filterWrongPromotions, { category: 1, biggestDiscount: 1, biggestDiscountCloth: 1, lowestPrice: 1 })
      .sort({ biggestDiscount: -1 })
      .skip(currentPage === 1? 0 : (currentPage - 1) * offset)
      .limit(offset)
      .populate('biggestDiscountCloth')
      .populate('lowestPriceCloth')
      .exec()

      const count = await Promotion.count({})
      const pages = count % offset > 0? parseInt(count / offset) + 1 : parseInt(count / offset)

      const pagination = {
        currentPage,
        offset,
        totalPages: parseInt(count / offset) < 1? 1 : pages,
        totalItems: count
      }

      res.send({ promotions, pagination })
    } catch(e) {
      console.log('ERROR:', e)
      res.status(500).send({ error: e.toString() })
    }
  }
}
