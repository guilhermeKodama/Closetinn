const validators = require('../../middleware/validators')
const controller = require('./controller')
const json = require('express-jsonschema')
const schemas = require('./schemas')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/cart`

router.post('/', json.validate({ body: schemas.createCart }), validators.checkAnonymousCredential, version({ '1.0.0': controller.createCart }))
router.post('/:id/product', json.validate({ body: schemas.addClothToCart }), validators.checkAnonymousCredential, version({ '1.0.0': controller.addClothToCart }))
router.get('/:id', version({ '1.0.0': controller.getCart }))
router.put('/:id/product/:productId', json.validate({ body: schemas.updateCartProductOrder }), validators.checkAnonymousCredential, version({ '1.0.0': controller.updateCartProductOrder }))
router.delete('/:id/product/:productId', json.validate({ body: schemas.removeProductFromCart }), validators.checkAnonymousCredential, version({ '1.0.0': controller.removeProductFromCart }))
router.put('/:id', validators.ensurePermission(['admin', 'user']), json.validate({ body: schemas.updateCart }), version({ '1.0.0': controller.updateCart }))

module.exports = {
  router,
  baseUrl
}
