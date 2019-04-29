const security = require('../../utils/security')
import { each } from 'async'
import logger from'morgan'
import config from '/config'
import jwt from 'jsonwebtoken'
import { ObjectID } from 'mongodb'
import recommendations from '/src/utils/recommendations'
import User from '/src/models/user'
import Subscription from '/src/models/subscription'
import Cloth from '/src/models/cloth'
import RecommendationLooksHistory from '/src/models/recommendationLooksHistory'
import RecommendationPromotionsHistory from '/src/models/recommendationPromotionsHistory'

  /**
    * @apiDefine HeaderV1Secure
    *
    * @apiHeader {String} Content-Type    Type of the body sent to the API.
    * @apiHeader {String} x-auth-token    Required token used in the authentication.
    * @apiHeader {String} Accept-Version  API version, if nothing is passed a wildcard (*) is used instead.
    *
    * @apiHeaderExample {json} Header-Example:
    *    {
    *      "Content-Type": "application/json",
    *      "x-auth-token": $token,
    *      "Accept-Version": "2.2.2"
    *    }
    */

  /**
    * @apiDefine HeaderV1Unsecure
    *
    * @apiHeader {String} Content-Type    Type of the body sent to the API.
    * @apiHeader {String} Accept-Version  API version, if nothing is passed a wildcard (*) is used instead.
    *
    * @apiHeaderExample {json} Header-Example:
    *    {
    *      "Content-Type": "application/json",
    *      "Accept-Version": "2.2.2"
    *    }
    */

module.exports = {

  /**
    * @apiDefine UserSucccess
    *
    * @apiSuccess {String}   _id                 Unique id of the User.
    * @apiSuccess {String}   email               Email of the User.
    * @apiSuccess {String}   name                Name of the User.
    * @apiSuccess {Object[]} closet              List of folders (niche).
    * @apiSuccess {String}   closet._id          Unique id of the closet.
    * @apiSuccess {String}   closet.folderName   Closet folder name.
    * @apiSuccess {String[]} closet.products     List of product id.
    * @apiSuccess {String}   closet.description  Closet description.
    *
    * @apiSuccessExample {json} Success-Response:
    *    HTTP/1.1 200 OK
    *    {
    *      "_id": "5a6bb60327a9e16435d08c32",
    *      "email": "kayron@closetinn.com.br",
    *      "name": "Kayron Cabral",
    *      "closet": [
    *        {
    *          "_id": "5aad9f1b7d70d967320a4883",
    *          "folderName": "Verão 🌞",
    *          "products": [
    *            "5a142dffdc11eb497f076dbd"
    *          ],
    *          "description": "Roupas para usar no verão"
    *        }
    *      ]
    *    }
    */

  /**
    * @apiDefine TokenError
    *
    * @apiError Unauthorized  Only authenticated users can access the data.
    *
    * @apiErrorExample Unauthorized (example):
    *    HTTP/1.1 401 Unauthorized
    *    {
    *      "error": "Unauthorized"
    *    }
    *
    * @apiError Unauthorized  Missing token in header.
    *
    * @apiErrorExample Unauthorized (example):
    *    HTTP/1.1 401 Unauthorized
    *    {
    *      "error": "Missing token"
    *    }
    */

  getMe: async (req, res, next) => {
    res.json(req.user)
  },

  /**
    * @api {post} /user User signup
    * @apiVersion 1.0.0
    * @apiName UserSignup
    * @apiGroup Users
    * @apiPermission none
    *
    * @apiDescription Insert user in the database and return saved data
    *
    * @apiParam {String} email    User email.
    * @apiParam {String} password User password with at least 6 characters.
    * @apiParam {String} name     Optional full name of the User.
    *
    * @apiExample {curl} Example usage:
    *    curl -X POST -H "Content-Type: application/json" -H "x-access-token: $token" -d
    *    '{
    *       "email": "kayron@closetinn.com.br",
    *       "name": "Kayron Cabral",
    *       "password": "123456"
    *    }' "http://localhost:3000/user"
    *
    * @apiUse UserSucccess
    *
    * @apiSuccess {String} token  Valid User token.
    *
    * @apiError UserAlredyExist User alredy exist. Email must be unique.
    *
    * @apiErrorExample {json} UserAlredyExist (example):
    *     HTTP/1.1 409 Conflict
    *     {
    *       "error": {
    *         "message": "User already exist"
    *       }
    *     }
    *
    * @apiError UnprocessableEntity Invalid format or missing property.
    *
    * @apiErrorExample {json} UnprocessableEntity (example):
    *     HTTP/1.1 422 Unprocessable Entity
    *     {
    *       "error": {
    *         "message": "Invalid format or missing required property"
    *       }
    *     }
    *
    * @apiUse HeaderV1Unsecure
    */
  unsubscribe: async (req, res, next) => {
    try {
      const { reasons, suggestion } = req.body
      const user = await User.findOneAndUpdate({
        _id: new ObjectID(req.user._id)
      }, {
        $set: { disabled: true }
      }, {
        new: true,
        projection: {
          password: 0,
          salt: 0,
          __v: 0
        }
      })

      const subscription = new Subscription({
        user:  new ObjectID(req.user._id),
        subscribed: false,
        reasons,
        suggestion
      })

      await subscription.save()

      res.json(user)
    } catch(e) {
      console.log('ERROR:', e)
      res.status(500).json({ error: e && e.message })
    }
  },

  /**
    * @api {get} /users/:userId Get logged User informations
    * @apiVersion 1.0.0
    * @apiName GetUserByToken
    * @apiGroup User
    * @apiPermission user
    *
    * @apiDescription Return information about the current logged user
    *
    * Remember to use the token that was obtained by posting to `user/auth`
    *
    * @apiExample {curl} Example usage:
    *    curl -X GET -H "Content-Type: application/json" -H "x-access-token: $token" "http://localhost:5000/users/me"
    *
    * @apiUse UserSucccess
    *
    * @apiUse TokenError
    */
  getUser: async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findOne({ _id: new ObjectID(userId) }, { password: 0, salt: 0, __v: 0 })
    res.json(user)
  },

  /**
    * @api {post} /user User signup
    * @apiVersion 1.0.0
    * @apiName UserSignup
    * @apiGroup Users
    * @apiPermission none
    *
    * @apiDescription Insert user in the database and return saved data
    *
    * @apiParam {String} email    User email.
    * @apiParam {String} password User password with at least 6 characters.
    * @apiParam {String} name     Optional full name of the User.
    *
    * @apiExample {curl} Example usage:
    *    curl -X POST -H "Content-Type: application/json" -H "x-access-token: $token" -d
    *    '{
    *       "email": "kayron@closetinn.com.br",
  	*       "name": "Kayron Cabral",
  	*       "password": "123456"
    *    }' "http://localhost:3000/user"
    *
    * @apiUse UserSucccess
    *
    * @apiSuccess {String} token  Valid User token.
    *
    * @apiError UserAlredyExist User alredy exist. Email must be unique.
    *
    * @apiErrorExample {json} UserAlredyExist (example):
    *     HTTP/1.1 409 Conflict
    *     {
    *       "error": {
    *         "message": "User already exist"
    *       }
    *     }
    *
    * @apiError UnprocessableEntity Invalid format or missing property.
    *
    * @apiErrorExample {json} UnprocessableEntity (example):
    *     HTTP/1.1 422 Unprocessable Entity
    *     {
    *       "error": {
    *         "message": "Invalid format or missing required property"
    *       }
    *     }
    *
    * @apiUse HeaderV1Unsecure
    */
  createUser: function(req, res, next) {
    var user = new User(req.body)

    user.save().then(() => {
      return user.generateAuthToken()
    }).then((token) => {
      res.send({
        token,
        _id: user._id,
        email: user.email,
        name: user.name,
        closet: user.closet
      })
    }).catch((error) => {
      if (error.code === 11000) {
        res.status(409).send({ message: 'User already exist' })
      } else {
        res.status(400).send(error)
      }
    })
  },

  /**
  @api {put} /users/:userId User update
  @apiPermission user
  @apiVersion 1.0.0
  @apiName UserUpdate
  @apiGroup Users
  @apiDescription
  User update
  **/
  updateUser: function(req, res, next) {
    const { userId } = req.params

    if (req.body.password) {
      const { passwordHashed, salt } = security.encrypt(req.body.password)
      req.body.password = passwordHashed
      req.body.salt = salt
    }

    if (req.body.name) {
      let name = req.body.name.trim().split(' ')

      req.body.firstName = name[0]
      req.body.lastName = name[1] || ''
    }

    User.findOneAndUpdate({
      _id: new ObjectID(userId)
    }, {
      $set: req.body
    }, {
      new: true,
      projection: {
        password: 0,
        salt: 0,
        __v: 0
      }
    }).then((user) => {
      res.send(user)
    }, error => {
      res.status(400).send(error)
    })
  },

  /**
   * @api {get} /users/:userId/closet Get Closet informations
   * @apiVersion 1.0.0
   * @apiName GetUserClosetFolders
   * @apiGroup User
   * @apiPermission user
   *
   * @apiExample {curl} Example usage:
   *    curl -X GET -H "Content-Type: application/json" -H "x-access-token: $token" "http://localhost:5000/user/closet"
   *
   * @apiUse UserSucccess
   *
   * @apiUse TokenError
   */
  getUserCloset: async (req, res, next) => {
    try {
      const { userId } = req.params
      const user = await User.findOne({ _id: new ObjectID(userId) }, { password: 0, salt: 0, __v: 0 })

      if (!user) return res.status(409).send({ message: 'Folder alredy exist.' })

      await user.fetchCloset()

      return res.json({ closet: user.closet })
    } catch(error) {
      return res.status(500).json({ error })
    }
  },

  /**
    * @api {get} /users/:userId/closet/:closetID Get Closet Folder information
    * @apiVersion 1.0.0
    * @apiName GetUserClosetFolder
    * @apiGroup User
    * @apiPermission user
    *
    * @apiExample {curl} Example usage:
    *    curl -X GET -H "Content-Type: application/json" -H "x-access-token: $token" "http://localhost:5000/user/closet"
    *
    * @apiUse UserSucccess
    *
    * @apiUse TokenError
    */
  getUserClosetClothes: async (req, res, next) => {
    try {
      const { userId, folderId } = req.params
      const user = await User.findOne({ _id: new ObjectID(userId) }, { password: 0, salt: 0, __v: 0 })

      const closet = user.closet
      for(let i = 0; i < closet.length; i++) {
        if(closet[i]._id.toString() === folderId) {
          const products = closet[i].products
          const result = await Cloth.find({ '_id': { '$in': products } })
          user.closet[i].products = result
          return res.json({ ...user.closet[i] })
        }
      }

      return res.status(404).json({ error: 'Folder not found.' })
    } catch(error) {
      return res.status(500).json({ error })
    }
  },

  /**
    * @api {post} /users/closet/folders Create Closet folder
    * @apiVersion 1.0.0
    * @apiName UserClosetCreateFolder
    * @apiGroup User
    * @apiPermission user
    *
    * @apiParam {String} folderName  Name of the folder.
    * @apiParam {String} productId   Option unique id of the product.
    * @apiParam {String} description Optional description of the folder.
    *
    * @apiParamExample {json} Request-Example:
    *    {
    *      "folderName": "Verão 🌞",
    *      "productId": "5a142dffdc11eb497f076dbd"
    *      "description": "Roupas para usar no verão"
    *    }
    *
    * @apiExample {curl} Example usage:
    *    curl -X POST -H "Content-Type: application/json" -H "x-access-token: $token" -d
    *    '{
    *      "folderName": "Verão 🌞",
    *      "productId": "5a142dffdc11eb497f076dbd"
    *      "description": "Roupas para usar no verão"
    *    }' "http://localhost:3000/users/closet/folders"
    *
    * @apiUse UserSucccess
    *
    * @apiError FolderAlredyExist Folder name must be unique.
    *
    * @apiErrorExample {json} FolderAlredyExist (example):
    *     HTTP/1.1 409 Conflict
    *     {
    *       "error": {
    *         "message": "Folder already exist"
    *       }
    *     }
    *
    * @apiError UnprocessableEntity Invalid format or missing property.
    *
    * @apiErrorExample {json} UnprocessableEntity (example):
    *     HTTP/1.1 422 Unprocessable Entity
    *     {
    *       "error": {
    *         "message": "Invalid format or missing required property"
    *       }
    *     }
    *
    * @apiUse TokenError
    */
  createClosetFolder: async (req, res, next) => {
    const { userId } = req.params
    // The folder can be created empty or with an initial product
    let productId = []
    if (req.body.productId) {
      if (!ObjectID.isValid(req.body.productId)) return res.status(400).send({ message: 'Product invalid.' })
      productId = [new ObjectID(req.body.productId)]
    }

    const description = req.body.description || ""

    try {
      const user = await User.findOneAndUpdate({
        _id: new ObjectID(userId),
        'closet.folderName': { $ne: req.body.folderName } // Ensures that the folder name doesn't exist
      }, {
        $push: { 'closet': { _id: new ObjectID(), folderName: req.body.folderName, products: productId, description: description } }
      }, {
        new: true,
        projection: {
          password: 0,
          salt: 0
        }
      })

      if (!user) return res.status(409).send({ message: 'Folder alredy exist.' })

      await user.fetchCloset()

      return res.json({ closet: user.closet })
    } catch(error) {
      return res.status(500).json({ error })
    }
  },

  /**
    * @api {put} /users/closet/folders/:id Update Closet folder
    * @apiVersion 1.0.0
    * @apiName UserClosetEditFolder
    * @apiGroup User
    * @apiPermission user
    *
    * @apiParam {String} :id  Id of the folder.
    *
    * @apiParamExample Request-Example:
    *    ":id": "5aad9f1b7d70d967320a4883"
    *
    * @apiParam {String} folderName  Optional name of the folder.
    * @apiParam {String} description Optional description of the folder.
    *
    * @apiParamExample {json} Request-Example:
    *    {
    *      "folderName": "Verão 🌞",
    *      "description": "Roupas para usar no verão"
    *    }
    *
    * @apiExample {curl} Example usage:
    *    curl -X PUT -H "Content-Type: application/json" -H "x-access-token: $token" -d
    *    '{
    *      "folderName": "Verão 🌞",
    *      "description": "Roupas para usar no verão"
    *    }' "http://localhost:3000/users/closet/folders/:id"
    *
    * @apiUse UserSucccess
    *
    * @apiError FolderNotFound The id of the folder was not found.
    *
    * @apiErrorExample {json} FolderNotFound (example):
    *     HTTP/1.1 404 Not Found
    *     {
    *       "message": "Folder not found."
    *     }
    *
    * @apiError FolderAlredyExist Folder name must be unique.
    *
    * @apiErrorExample {json} FolderAlredyExist (example):
    *     HTTP/1.1 409 Conflict
    *     {
    *       "message": "Folder already exist"
    *     }
    *
    * @apiUse TokenError
    */
  updateClosetFolder: async (req, res, next) => {
    const { userId, folderId } = req.params
    if (!ObjectID.isValid(folderId)) return res.status(404).send({ message: 'Folder not found.' })

    const folderName = req.body.folderName
    const description = req.body.description
    let query, update

    query = { _id: new ObjectID(userId), 'closet._id': new ObjectID(folderId) }
    update = { $set: { 'closet.$.folderName': req.body.folderName, 'closet.$.description': description } }

    try {
      let user = await User.findOneAndUpdate(query, update, {
        new: true,
        projection: {
          password: 0,
          salt: 0
        }
      })

      await user.fetchCloset()

      return res.json({ closet: user.closet })
    } catch(error) {
      return res.status(500).json({ error })
    }
  },

  /**
    * @api {delete} /users/:userId/closet/folders/:folderId Delete Closet folder
    * @apiVersion 1.0.0
    * @apiName UserClosetRemoveFolder
    * @apiGroup User
    * @apiPermission user
    *
    * @apiParam {String} :id  Unique id of the folder to be deleted.
    *
    * @apiParamExample Request-Example:
    *    ":id": "5aad9f1b7d70d967320a4883"
    *
    * @apiSuccessExample {json} Success-Response:
    *    HTTP/1.1 200 OK
    *    {
    *      "_id": "5a6bb60327a9e16435d08c32",
    *      "email": "kayron@closetinn.com.br",
    *      "name": "Kayron Cabral",
    *      "closet": []
    *    }
    *
    * @apiExample {curl} Example usage:
    *    curl -X DELETE -H "Content-Type: application/json" -H "x-access-token: $token" "http://localhost:3000/users/closet/folders/:id"
    *
    * @apiError FolderNotFound The id of the folder was not found.
    *
    * @apiErrorExample {json} FolderNotFound (example):
    *     HTTP/1.1 404 Not Found
    *     {
    *       "message": "Folder not found."
    *     }
    *
    * @apiUse TokenError
    */
  removeClosetFolder: async (req, res, next) => {
    const { userId, folderId } = req.params
    if (!ObjectID.isValid(folderId)) return res.status(404).send({ message: 'Folder not found.' })

    try {
      const user = await User.findOneAndUpdate({
        _id: new ObjectID(userId),
        'closet._id': new ObjectID(folderId)
      }, {
        $pull: { 'closet': { _id: new ObjectID(folderId) } }
      }, {
        new: true,
        projection: {
          password: 0,
          salt: 0
        }
      })

      if (!user) return res.status(404).send({ message: 'Folder not found.' })

      await user.fetchCloset()

      return res.json({ closet: user.closet })
    } catch(error) {
      return res.status(500).json({ error })
    }
  },

  /**
    * @api {post} /users/:userId/closet/folders/:folderId/products Add product to Closet folder
    * @apiVersion 1.0.0
    * @apiName UserClosetAddProductToFolder
    * @apiGroup User
    * @apiPermission user
    *
    * @apiParam {String} :folderId  Unique id of the folder.
    *
    * @apiParamExample Request-Example:
    *    ":folderId": "5aad9f1b7d70d967320a4883"
    *
    * @apiParam {String} productId   Unique id of the product.
    *
    * @apiParamExample {json} Request-Example:
    *    {
    *      "productId": "5aad73c10aff515ea9646ecd"
    *    }
    *
    * @apiExample {curl} Example usage:
    *    curl -X POST -H "Content-Type: application/json" -H "x-access-token: $token" -d
    *    '{
    *      "productId": "5aad73c10aff515ea9646ecd"
    *    }' "http://localhost:3000/users/closet/folders/:folderId/products"
    *
    * @apiUse UserSucccess
    *
    * @apiError InvalidProductId Invalid id.
    *
    * @apiErrorExample {json} InvalidProductId (example):
    *     HTTP/1.1 400 Bad Request
    *     {
    *       "message": "Product invalid."
    *     }
    *
    * @apiError FolderNotFound The id of the folder was not found.
    *
    * @apiErrorExample {json} FolderNotFound (example):
    *     HTTP/1.1 404 Not Found
    *     {
    *       "message": "Folder not found."
    *     }
    *
    * @apiError UnprocessableEntity Invalid format or missing property.
    *
    * @apiErrorExample {json} UnprocessableEntity (example):
    *     HTTP/1.1 422 Unprocessable Entity
    *     {
    *       "error": {
    *         "message": "Invalid format or missing required property"
    *       }
    *     }
    *
    * @apiUse TokenError
    */
  addProductToClosetFolder: async (req, res, next) => {
    const { userId, folderId } = req.params
    const { productId } = req.body
    if (!ObjectID.isValid(folderId)) return res.status(404).send({ message: 'Folder not found.' })
    if (!ObjectID.isValid(productId)) return res.status(400).send({ message: 'Product invalid.' })

    try {
      const user = await User.findOneAndUpdate({
        _id: new ObjectID(userId),
        'closet._id': new ObjectID(folderId)
      }, {
        $addToSet: { 'closet.$.products': new ObjectID(productId) }
      }, {
        new: true,
        projection: {
          password: 0,
          salt: 0
        }
      })

      if (!user) return res.status(404).send({ message: 'Folder not found.' })

      await user.fetchCloset()

      return res.json({ closet: user.closet })
    } catch(error) {
      return res.status(500).json({ error })
    }
  },

  /**
    * @api {delete} /users/:userId/closet/folders/:folderId/products/:productId Remove product from Closet folder
    * @apiVersion 1.0.0
    * @apiName UserClosetRemoveProductFromFolder
    * @apiGroup User
    * @apiPermission user
    *
    * @apiParam {String} :folderId  Unique id of the folder.
    *
    * @apiParamExample Request-Example:
    *    ":folderId": "5aad73c10aff515ea9646ecd"
    *
    * @apiParam {String} :productId  Unique id of the product.
    *
    * @apiParamExample Request-Example:
    *    ":productId": "5aad73c10aff515ea9646ecd"
    *
    * @apiExample {curl} Example usage:
    *    curl -X DELETE -H "Content-Type: application/json" -H "x-access-token: $token" "http://localhost:3000/users/closet/:folders/:folderId/products/:productId"
    *
    * @apiSuccess {String}   _id                 Unique id of the User.
    * @apiSuccess {String}   email               Email of the User.
    * @apiSuccess {String}   name                Name of the User.
    * @apiSuccess {Object[]} closet              List of folders (niche).
    * @apiSuccess {String}   closet._id          Unique id of the closet.
    * @apiSuccess {String}   closet.folderName   Closet folder name.
    * @apiSuccess {String[]} closet.products     List of product id.
    * @apiSuccess {String}   closet.description  Closet description.
    *
    * @apiSuccessExample {json} Success-Response:
    *    HTTP/1.1 200 OK
    *    {
    *      "_id": "5a6bb60327a9e16435d08c32",
    *      "email": "kayron@closetinn.com.br",
    *      "name": "Kayron Cabral",
    *      "closet": [
    *        {
    *          "_id": "5aad73c10aff515ea9646ecd",
    *          "folderName": "Verão 🌞",
    *          "products": [],
    *          "description": "Roupas para usar no verão"
    *        }
    *      ]
    *    }
    *
    * @apiError FolderNotFound The id of the folder was not found.
    *
    * @apiErrorExample {json} FolderNotFound (example):
    *     HTTP/1.1 404 Not Found
    *     {
    *       "message": "Folder not found."
    *     }
    *
    * @apiError ProductNotFound The id of the folder was not found.
    *
    * @apiErrorExample {json} ProductNotFound (example):
    *     HTTP/1.1 404 Not Found
    *     {
    *       "message": "Product not found in folder."
    *     }
    *
    * @apiUse TokenError
    */
  removeProductFromClosetFolder: async (req, res, next) => {
    const { userId, folderId, productId } = req.params
    if (!ObjectID.isValid(folderId)) return res.status(404).send({ message: 'Folder not found.' })
    if (!ObjectID.isValid(productId)) return res.status(404).send({ message: 'Product not found in folder.' })

    try {
      const user = await User.findOneAndUpdate({
        _id: new ObjectID(userId),
        'closet._id': new ObjectID(folderId)
      }, {
        $pull: { 'closet.$.products': new ObjectID(productId) }
      }, {
        new: true,
        projection: {
          password: 0,
          salt: 0
        }
      })

      if (!user) return res.status(404).send({ message: 'Folder not found.' })

      await user.fetchCloset()

      return res.json({ closet: user.closet })
    } catch(error) {
      return res.status(500).json({ error })
    }
  },

  /**
    @api {post} /users/:email/password/reset Reset user password
    @apiVersion 1.0.0
    @apiName resetPassword
    @apiGroup Auth
    @apiDescription
  */
  resetPassword: function(req, res, next) {
    const token = req.body.token

    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        if(err.name === 'TokenExpiredError') {
          return res.status(401).send({ message: 'Token has expired!' })
        } else {
          return res.status(401).send({ message: 'Token is not valid!' })
        }
      } else {
        if (decoded.email) {
          // Check if user exist
          User.findOne({ email: decoded.email }).then((user) => {
            if (!user) return res.status(404).send({ message: 'User not found.' })

            //reset password
            const { passwordHashed, salt } = security.encrypt(req.body.newPassword)
            const newEncryptedPassword = {
              password: passwordHashed,
              salt: salt
            }

            // update new password and salt with mongo
            User.findOneAndUpdate({
              _id: new ObjectID(user._id)
            }, {
              $set: newEncryptedPassword
            }, {
              new: true,
              projection: {
                password: 0,
                salt: 0,
                __v: 0
              }
            }).then((user) => {
              return res.send()
            }, error => {
              return res.status(400).send(error)
            })
          })
        } else {
          return res.status(401).send({ message: 'Token wrongly decoded' })
        }
      }
    })
  },

  getRecommendationLooks: async (req, res, next) => {
    try {
      const { userId, lookId } = req.params

      if (!ObjectID.isValid(userId)) return res.status(404).send({ message: 'User not found.' })
      if (!ObjectID.isValid(lookId)) return res.status(404).send({ message: 'Look not found.' })

      const conditions = { _id: new ObjectID(lookId), user: new ObjectID(userId) }

      let recommendations = await RecommendationLooksHistory.findOne(conditions).populate({ path: 'looks', populate: { path: 'products', model: 'Cloth' } }).lean()
      const user = await User.findById(userId)

      if (!recommendations) return res.status(404).json({ error: 'Looks recommendation not found!' })

      recommendations = recommendations.looks.map(look => {
        return {
          ...look,
          products: look.products.map(product => {
            return {
              ...product,
              liked: user.likedProducts.includes(product._id.toString()),
              disliked: user.dislikedProducts.includes(product._id.toString()),
            }
          }),
          liked: user.likedLooks.includes(look._id.toString()),
          disliked: user.dislikedLooks.includes(look._id.toString()),
        }
      })

      res.json({ looks: recommendations })
    } catch (e) {
      res.status(500).json({ error: e && e.toString() })
    }
  },

  getRecommendationPromotions: async (req, res, next) => {
    try {
      const { userId, promotionId } = req.params

      if (!ObjectID.isValid(userId)) return res.status(404).send({ message: 'User not found.' })
      if (!ObjectID.isValid(promotionId)) return res.status(404).send({ message: 'Promotion not found.' })

      const conditions = { _id: new ObjectID(promotionId), user: new ObjectID(userId) }

      let recommendations = await RecommendationPromotionsHistory.findOne(conditions).populate('promotions').lean()
      const user = await User.findById(userId)

      if (!recommendations) return res.status(404).json({ error: 'Promotions recommendation not found!' })

      recommendations = recommendations.promotions.map(product => {
        return {
          ...product,
          liked: user.likedProducts.includes(product._id.toString()),
          disliked: user.dislikedProducts.includes(product._id.toString()),
        }
      })

      res.json({ products: recommendations })
    } catch (e) {
      res.status(500).json({ error: e && e.toString() })
    }
  },

  likeLook: async (req, res, next) => {
    try {
      const { userId, lookId } = req.params

      if (!ObjectID.isValid(userId)) return res.status(404).send({ message: 'User not found.' })
      if (!ObjectID.isValid(lookId)) return res.status(404).send({ message: 'Look not found.' })

      const conditions = { _id: new ObjectID(userId) }
      const update = { $addToSet: { 'likedLooks': lookId }, $pull: { 'dislikedLooks': lookId } }
      const options = { new: true }

      const user = await User.findOneAndUpdate(conditions, update, options)

      const liked = user.likedLooks.includes(lookId)
      const disliked = user.dislikedLooks.includes(lookId)

      res.json({ liked, disliked })
    } catch (e) {
      res.status(500).json({ error: e && e.toString() })
    }
  },

  dislikeLook: async (req, res, next) => {
    try {
      const { userId, lookId } = req.params

      if (!ObjectID.isValid(userId)) return res.status(404).send({ message: 'User not found.' })
      if (!ObjectID.isValid(lookId)) return res.status(404).send({ message: 'Look not found.' })

      const conditions = { _id: new ObjectID(userId) }
      const update = { $addToSet: { 'dislikedLooks': lookId }, $pull: { 'likedLooks': lookId } }
      const options = { new: true }

      const user = await User.findOneAndUpdate(conditions, update, options)

      const liked = user.likedLooks.includes(lookId)
      const disliked = user.dislikedLooks.includes(lookId)

      res.json({ liked, disliked })
    } catch (e) {
      res.status(500).json({ error: e && e.toString() })
    }
  },

  likeProduct: async (req, res, next) => {
    try {
      const { userId, productId } = req.params

      if (!ObjectID.isValid(userId)) return res.status(404).send({ message: 'User not found.' })
      if (!ObjectID.isValid(productId)) return res.status(404).send({ message: 'Product not found.' })

      const conditions = { _id: new ObjectID(userId) }
      const update = { $addToSet: { 'likedProducts': productId }, $pull: { 'dislikedProducts': productId } }
      const options = { new: true }

      const user = await User.findOneAndUpdate(conditions, update, options)

      const liked = user.likedProducts.includes(productId)
      const disliked = user.dislikedProducts.includes(productId)

      res.json({ liked, disliked })
    } catch (e) {
      res.status(500).json({ error: e && e.toString() })
    }
  },

  dislikeProduct: async (req, res, next) => {
    try {
      const { userId, productId } = req.params

      if (!ObjectID.isValid(userId)) return res.status(404).send({ message: 'User not found.' })
      if (!ObjectID.isValid(productId)) return res.status(404).send({ message: 'Product not found.' })

      const conditions = { _id: new ObjectID(userId) }
      const update = { $addToSet: { 'dislikedProducts': productId }, $pull: { 'likedProducts': productId } }
      const options = { new: true }

      const user = await User.findOneAndUpdate(conditions, update, options)

      const liked = user.likedProducts.includes(productId)
      const disliked = user.dislikedProducts.includes(productId)

      res.json({ liked, disliked })
    } catch (e) {
      res.status(500).json({ error: e && e.toString() })
    }
  },

}
