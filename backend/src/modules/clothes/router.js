const validators = require('../../middleware/validators')
const controller = require('./controller')
const json = require('express-jsonschema')
const schemas = require('./schemas')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/products`

router.get('/:productId', version({ '1.0.0': controller.getProduct }))
router.get('/', json.validate({query: schemas.getQuery}), version({ '1.0.0': controller.getProducts }))
router.get('/statistics/filters', json.validate({query: schemas.getFilterQuery}), version({ '1.0.0': controller.getProductsFilters }))
router.get('/statistics/categories', json.validate({query: schemas.getCategoriesQuery}), version({ '1.0.0': controller.getProductsCategories }))

module.exports = {
  router,
  baseUrl
}
