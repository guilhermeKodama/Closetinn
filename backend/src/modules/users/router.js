const validators = require('../../middleware/validators')
const controller = require('./controller')
const json = require('express-jsonschema')
const schemas = require('./schemas')
const router = require('express').Router()
const version = require('express-routes-versioning')()
const config = require('../../../config')
const baseUrl = `${config.prefix}/users`

/*
 Closet routes
*/
router.get('/:userId/closet', validators.ensurePermission(), version({ '1.0.0': controller.getUserCloset }))
router.get('/:userId/closet/:folderId', validators.ensurePermission(), version({ '1.0.0': controller.getUserClosetClothes }))
router.delete('/:userId/closet/folders/:folderId', validators.ensurePermission(), version({ '1.0.0': controller.removeClosetFolder }))
router.delete('/:userId/closet/folders/:folderId/products/:productId', validators.ensurePermission(), version({ '1.0.0': controller.removeProductFromClosetFolder }))
router.post('/:userId/closet/folders', validators.ensurePermission(), json.validate({ body: schemas.postFolder }), version({ '1.0.0': controller.createClosetFolder }))
router.put('/:userId/closet/folders/:folderId', validators.ensurePermission(), json.validate({ body: schemas.putFolder }), version({ '1.0.0': controller.updateClosetFolder }))
router.post('/:userId/closet/folders/:folderId/products', validators.ensurePermission(), json.validate({ body: schemas.addProductToWishlist }), version({ '1.0.0': controller.addProductToClosetFolder }))

/*
 User routes
*/
router.get('/me', validators.ensurePermission(), version({ '1.0.0': controller.getMe }))
router.put('/unsubscribe', validators.ensurePermission(), json.validate({ body: schemas.unsubscribe }), version({ '1.0.0': controller.unsubscribe }))
router.get('/:userId', validators.ensurePermission(), version({ '1.0.0': controller.getUser }))
router.post('/', json.validate({ body: schemas.post}), version({ '1.0.0': controller.createUser }))
router.put('/:userId', validators.ensurePermission(), json.validate({ body: schemas.put }), version({ '1.0.0': controller.updateUser }))
router.post('/:email/password/reset', json.validate({ body: schemas.resetPassword }), version({ '1.0.0': controller.resetPassword }))

/*
 Recommendation looks
*/
router.get('/:userId/recommendations/promotions/:promotionId', version({ '1.0.0': controller.getRecommendationPromotions }))
router.get('/:userId/recommendations/looks/:lookId', version({ '1.0.0': controller.getRecommendationLooks }))
router.post('/:userId/looks/:lookId/like', version({ '1.0.0': controller.likeLook }))
router.post('/:userId/looks/:lookId/dislike', version({ '1.0.0': controller.dislikeLook }))
router.post('/:userId/products/:productId/like', version({ '1.0.0': controller.likeProduct }))
router.post('/:userId/products/:productId/dislike', version({ '1.0.0': controller.dislikeProduct }))

module.exports = {
  router,
  baseUrl
}
