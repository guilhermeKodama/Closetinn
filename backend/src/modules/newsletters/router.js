const validators = require('../../middleware/validators')
const controller = require('./controller')
const json = require('express-jsonschema')
const schemas = require('./schemas')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/newsletters`

router.post('/', json.validate({body: schemas.createSubscription}), version({ '1.0.0': controller.createSubscription }))
router.delete('/:id', version({ '1.0.0': controller.deleteSubscription }))

module.exports = {
  router,
  baseUrl
}
