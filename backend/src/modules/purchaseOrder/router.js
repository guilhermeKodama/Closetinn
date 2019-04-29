const validators = require('../../middleware/validators')
const controller = require('./controller')
const json = require('express-jsonschema')
const schemas = require('./schemas')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/purchaseOrders`

router.post('/', validators.ensurePermission(), json.validate({ body: schemas.createPO }), version({ '1.0.0': controller.createPO }))
router.get('/', validators.ensurePermission(), version({ '1.0.0': controller.getPOs }))
router.put('/:id/cancel', validators.ensurePermission(), version({ '1.0.0': controller.cancelPO }))

module.exports = {
  router,
  baseUrl
}
