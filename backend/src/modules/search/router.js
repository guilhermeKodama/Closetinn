const controller = require('./controller')
const json = require('express-jsonschema')
const schemas = require('./schemas')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/search`

router.get('/', json.validate({query: schemas.search}), version({ '1.0.0': controller.search }))
router.get('/mlapi', json.validate({query: schemas.mlapiSearch}), version({ '1.0.0': controller.mlapiSearch }))
router.get('/elasticsearch', json.validate({query: schemas.elasticSearch}), version({ '1.0.0': controller.elasticSearch }))

module.exports = {
  router,
  baseUrl
}
