const validators = require('../../middleware/validators')
const controller = require('./controller')
const json = require('express-jsonschema')
const schemas = require('./schemas')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/looks`

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router.get('/:id', validators.ensurePermission(['admin']), version({ '1.0.0': controller.getLook }))
router.get('/', validators.ensurePermission(['admin']), json.validate({ query: schemas.getLooks }), version({ '1.0.0': controller.getLooks }))
router.post('/', validators.ensurePermission(['admin']), upload.single('image'), json.validate({ body: schemas.createLook }), version({ '1.0.0': controller.createLook }))
router.put('/:id', validators.ensurePermission(['admin']), upload.single('image'), version({ '1.0.0': controller.updateLook }))

module.exports = {
  router,
  baseUrl
}
