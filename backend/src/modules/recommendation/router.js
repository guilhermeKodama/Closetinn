const validators = require('../../middleware/validators')
const controller = require('./controller')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/recommendation`

router.get('/text/:productId', version({ '1.0.0': controller.getRecommendationBasedOnDescription }))

module.exports = {
  router,
  baseUrl
}
