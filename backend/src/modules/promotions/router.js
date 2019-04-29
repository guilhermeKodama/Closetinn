const validators = require('../../middleware/validators')
const controller = require('./controller')
const json = require('express-jsonschema')
const schemas = require('./schemas')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/promotions`

router.get('/', json.validate({query: schemas.getPromotions}), version({ '1.0.0': controller.getPromotions }))
router.get('/:id', json.validate({query: schemas.getPromotion}), version({ '1.0.0': controller.getPromotion }))

module.exports = {
  router,
  baseUrl
}
