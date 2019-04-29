const validators = require('../../middleware/validators')
const controller = require('./controller')
const json = require('express-jsonschema')
const schemas = require('./schemas')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/analytics`

router.post('/pageView', json.validate({ body: schemas.pageView }), version({ '1.0.0': controller.pageView }))
router.post('/clicks', json.validate({ body: schemas.saveClick }), version({ '1.0.0': controller.saveClick }))

module.exports = {
  router,
  baseUrl
}
