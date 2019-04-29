const controller = require('./controller')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/healthcheck`

router.get('/', version({ '1.0.0': controller.getHealthcheck }))
router.get('/ping', version({ '1.0.0': controller.ping }))

module.exports = {
  router,
  baseUrl
}
