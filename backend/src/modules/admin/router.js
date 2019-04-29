const validators = require('../../middleware/validators')
const controller = require('./controller')
const json = require('express-jsonschema')
const schemas = require('./schemas')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/admin`

router.get('/unclassifiedClothes', validators.ensurePermission(['admin']), json.validate({query: schemas.getUnclassifiedClothesQuery}), version({ '1.0.0': controller.getUnclassifiedClothes }))
router.put('/unclassifiedClothes/:productId', validators.ensurePermission(['admin']), json.validate({ body: schemas.putUnclassifiedCloth }), version({ '1.0.0': controller.updateUnclassifiedCloth }))

module.exports = {
  router,
  baseUrl
}
