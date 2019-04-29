const validators = require('../../middleware/validators')
const controller = require('./controller')
const json = require('express-jsonschema')
const schemas = require('./schemas')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/auth`

router.post('/unknown', version({ '1.0.0': controller.authenticateUnknownUser }))
router.post('/', json.validate({body: schemas.authenticateUser}), version({ '1.0.0': controller.authenticateUser }))
router.post('/email', validators.ensurePermission(['admin']), json.validate({body: schemas.authenticateEmailUser}), version({ '1.0.0': controller.authenticateEmailUser }))
router.post('/forgot', json.validate({body: schemas.forgot}), version({ '1.0.0': controller.sendForgotPasswordEmail }))
router.post('/facebook', json.validate({body: schemas.postFacebook}), version({ '1.0.0': controller.authenticateAndSaveFacebookUser }))
router.post('/forgot/validate', json.validate({body: schemas.forgotValidate}), version({ '1.0.0': controller.checkIfForgotPasswordTokenIsValid }))
router.post('/admin/validate', json.validate({body: schemas.adminValidate}), version({ '1.0.0': controller.checkIfAdminTokenIsValid }))


module.exports = {
  router,
  baseUrl
}
