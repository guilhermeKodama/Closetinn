import chai from 'chai'
import sinon from 'sinon'
import async from 'async'
import { app } from '/app'
import config from '/config'
import chaiHttp from 'chai-http'
import { ObjectID } from 'mongodb'
import mongodb from '/src/utils/mongodb'
import security from '../../utils/security'
import User from '/src/models/user'
import Cloth from '/src/models/cloth'
import {
  user,
  validToken,
  invalidToken,
  expiredToken,
  invalidTokenForgotPassword,
  validTokenForgotPassword,
  newUser,
  invalidUser,
  updateUser,
  newFolder,
  defaultFolder,
  defaultProductId,
  newProductId,
  updateFolder,
  newFolderWithProduct,
  newFolderWithInvalidProduct
} from '/seeds/users'

const should = chai.should()
chai.use(chaiHttp)

describe('Users', () => {
  var token

  beforeEach((done) => {
    User.remove({}).then(() => {
      User.create(user).then(() => done())
    })
  })

  after((done) => {
    User.remove({}).then(() => done())
  })

  /*
   User routes
  */

  describe('POST /api/users', () => {

    it('should return 422 if send wrong body', (done) => {
      chai.request(app)
      .post(`/api/users`)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 200 and create a new user', (done) => {
      chai.request(app)
      .post('/api/users')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('_id')
        res.body._id.should.be.a('string')
        res.body.should.have.property('email')
        res.body.email.should.be.a('string')
        res.body.should.have.property('name')
        res.body.name.should.be.a('string')
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        done()
      })
    })

    it('should return 422 if missing required property', (done) => {
      chai.request(app)
      .post('/api/users')
      .send(invalidUser)
      .end((err, res) => {
        res.should.have.status(422)
        res.body.should.have.property('message')
        res.body.message.should.be.a('string')
        res.body.message.should.be.deep.equal("Unprocessable Entity")
        done()
      })
    })

    it('should return 409 if user alredy exist', (done) => {
      chai.request(app)
      .post('/api/users')
      .send({ email: user.email, password: user.password })
      .end((err, res) => {
        res.should.have.status(409)
        res.body.should.have.property('message')
        res.body.message.should.be.a('string')
        res.body.message.should.be.deep.equal("User already exist")
        done()
      })
    })

  })

  describe('GET /api/users/:userId', () => {

    it('should return 200 and an user object', (done) => {
      chai.request(app)
      .get(`/api/users/${user._id}`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('_id')
        res.body._id.should.be.a('string')
        res.body.should.have.property('email')
        res.body.email.should.be.a('string')
        res.body.should.have.property('name')
        res.body.name.should.be.a('string')
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        done()
      })
    })

  })

  describe('PUT /api/users/:userId', () => {

    it('should return 400 and return an error', (done) => {
      // stub database connection
      sinon.stub(User, 'findOneAndUpdate')
      .callsFake(() => {
        return Promise.reject()
      })

      chai.request(app)
      .put(`/api/users/${user._id}`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(400)
        User.findOneAndUpdate.restore()
        done()
      })
    })

    it('should return 200 and update an user object', (done) => {
      chai.request(app)
      .put(`/api/users/${user._id}`)
      .set('Authorization', validToken)
      .send(updateUser)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('_id')
        res.body._id.should.be.a('string')
        res.body.should.have.property('email')
        res.body.email.should.be.a('string')
        res.body.should.have.property('name')
        res.body.name.should.be.a('string')
        res.body.name.should.be.equal(updateUser.name)
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        done()
      })
    })

    it('should return 422 if extra fields are sent', (done) => {
      chai.request(app)
      .put(`/api/users/${user._id}`)
      .set('Authorization', validToken)
      .send({ somethingWeird: '' })
      .end((err, res) => {
        res.should.have.status(422)
        res.body.should.have.property('message')
        res.body.message.should.be.a('string')
        res.body.message.should.be.deep.equal("Unprocessable Entity")
        done()
      })
    })

  })

  describe('POST /api/users/:email/password/reset', () => {

    it('should return 400 if return a error', (done) => {
      // stub database connection
      sinon.stub(User, 'findOneAndUpdate')
      .callsFake(() => {
        return Promise.reject()
      })

      chai.request(app)
      .post(`/api/users/${user.email}/password/reset`)
      .send({ newPassword: '123321', token: validTokenForgotPassword })
      .end((err, res) => {
        res.should.have.status(400)
        User.findOneAndUpdate.restore()
        done()
      })
    })

    it('should return 422 if token is not send', (done) => {
      chai.request(app)
      .post(`/api/users/${user.email}/password/reset`)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 401 if token is invalid', (done) => {
      chai.request(app)
      .post(`/api/users/${user.email}/password/reset`)
      .send({ newPassword: '123', token: invalidToken })
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 401 if token is exprired', (done) => {
      chai.request(app)
      .post(`/api/users/${user.email}/password/reset`)
      .send({ newPassword: '123', token: expiredToken })
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 404 user dont exist', (done) => {
      const invalidTokenForgotPassword = security.generateForgotPasswordToken({ email: 'teste@gmail.com' })
      chai.request(app)
      .post(`/api/users/${newUser.email}/password/reset`)
      .send({ newPassword: '123321', token: invalidTokenForgotPassword })
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
    })

    it('should return 200 and reset a password', (done) => {
      chai.request(app)
      .post(`/api/users/${user.email}/password/reset`)
      .send({ newPassword: '123321', token: validTokenForgotPassword })
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
    })
  })

  /*
   Closet routes
  */

  describe('GET /api/users/:userId/closet', () => {

    it('should return 500 if return a error', (done) => {
      //stub database connection
      sinon.stub(Cloth, 'find')
      .callsFake(() => {
        return Promise.reject()
      })

      chai.request(app)
      .get(`/api/users/${user._id}/closet`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(500)
        Cloth.find.restore()
        done()
      })
    })

    it('should return 401 if token is not send', (done) => {
      chai.request(app)
      .get(`/api/users/${user._id}/closet`)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 401 if token is invalid', (done) => {
      const invalidToken = '123abc'

      chai.request(app)
      .get(`/api/users/${user._id}/closet`)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 200 and closet informations', (done) => {
      chai.request(app)
      .get(`/api/users/${user._id}/closet`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        res.body.closet[0].should.have.property('_id')
        res.body.closet[0]._id.should.be.a('string')
        res.body.closet[0].should.have.property('folderName')
        res.body.closet[0].folderName.should.be.a('string')
        res.body.closet[0].should.have.property('products')
        res.body.closet[0].products.should.be.a('array')
        res.body.closet[0].should.have.property('description')
        res.body.closet[0].description.should.be.a('string')
        done()
      })
    })

  })

  describe('GET /api/users/:userId/closet/:folderId', () => {

    it('should return 500 if return a error', (done) => {
      //stub database connection
      sinon.stub(Cloth, 'find')
      .callsFake(() => {
        return Promise.reject()
      })

      chai.request(app)
      .get(`/api/users/${user._id}/closet/${defaultFolder._id}`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(500)
        Cloth.find.restore()
        done()
      })
    })

    it('should return 401 if token is not send', (done) => {
      chai.request(app)
      .get(`/api/users/${user._id}/closet/${defaultFolder._id}`)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 401 if token is invalid', (done) => {
      const invalidToken = '123abc'

      chai.request(app)
      .get(`/api/users/${user._id}/closet/${defaultFolder._id}`)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 200 and closet informations', (done) => {
      chai.request(app)
      .get(`/api/users/${user._id}/closet/${defaultFolder._id}`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('_id')
        res.body._id.should.be.a('string')
        res.body.should.have.property('folderName')
        res.body.folderName.should.be.a('string')
        res.body.should.have.property('products')
        res.body.products.should.be.a('array')
        res.body.should.have.property('description')
        res.body.description.should.be.a('string')
        done()
      })
    })

  })

  describe('POST /api/users/:userId/closet/folders', () => {

    it('should return 401 if token is not send', (done) => {
      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders`)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 401 if token is invalid', (done) => {
      const invalidToken = '123abc'

      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders`)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 200 and create a closet folder (niche)', (done) => {
      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders`)
      .set('Authorization', validToken)
      .send(newFolder)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        done()
      })
    })

    it('should return 200 and create a closet folder (niche) with product', (done) => {
      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders`)
      .set('Authorization', validToken)
      .send(newFolderWithProduct)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        done()
      })
    })

    it('should return 409 if folder (niche) with product alredy exist', (done) => {
      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders`)
      .set('Authorization', validToken)
      .send(defaultFolder)
      .end((err, res) => {
        res.should.have.status(409)
        done()
      })
    })

    it('should return 400 if folder (niche) has a invalid product', (done) => {
      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders`)
      .set('Authorization', validToken)
      .send(newFolderWithInvalidProduct)
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
    })

  })

  describe('PUT /api/users/:userId/closet/folders/:folderId', () => {

    it('should return 500 and return an error', (done) => {
      // stub database connection
      sinon.stub(User, 'findOneAndUpdate')
      .callsFake(() => {
        return Promise.reject()
      })

      chai.request(app)
      .put(`/api/users/${user._id}/closet/folders/${newFolder._id}`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(500)
        User.findOneAndUpdate.restore()
        done()
      })
    })

    it('should return 401 if token is not send', (done) => {
      chai.request(app)
      .put(`/api/users/${user._id}/closet/folders/${newFolder._id}`)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 401 if token is invalid', (done) => {
      const invalidToken = '123abc'

      chai.request(app)
      .put(`/api/users/${user._id}/closet/folders/${newFolder._id}`)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 200 and update a closet folder (niche)', (done) => {
      chai.request(app)
      .put(`/api/users/${user._id}/closet/folders/${defaultFolder._id}`)
      .set('Authorization', validToken)
      .send(updateFolder)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        res.body.closet[0].should.have.property('_id')
        res.body.closet[0]._id.should.be.a('string')
        res.body.closet[0].should.have.property('folderName')
        res.body.closet[0].folderName.should.be.a('string')
        res.body.closet[0].should.have.property('products')
        res.body.closet[0].products.should.be.a('array')
        res.body.closet[0].should.have.property('description')
        res.body.closet[0].description.should.be.a('string')
        done()
      })
    })

    it('should return 404 if folder (niche) not found', (done) => {
      chai.request(app)
      .put(`/api/users/${user._id}/closet/folders/123`)
      .set('Authorization', validToken)
      .send(updateFolder)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
    })

  })

  describe('DELETE /api/users/:userId/closet/folders/:folderId', () => {

    it('should return 500 and return an error', (done) => {
      // stub database connection
      sinon.stub(User, 'findOneAndUpdate')
      .callsFake(() => {
        return Promise.reject()
      })

      chai.request(app)
      .delete(`/api/users/${user._id}/closet/folders/${newFolder._id}`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(500)
        User.findOneAndUpdate.restore()
        done()
      })
    })

    it('should return 401 if token is not send', (done) => {
      chai.request(app)
      .delete(`/api/users/${user._id}/closet/folders/${newFolder._id}`)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 401 if token is invalid', (done) => {
      const invalidToken = '123abc'

      chai.request(app)
      .delete(`/api/users/${user._id}/closet/folders/${newFolder._id}`)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 200 and delete a closet folder (niche)', (done) => {
      chai.request(app)
      .delete(`/api/users/${user._id}/closet/folders/${defaultFolder._id}`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        done()
      })
    })

    it('should return 404 if folder (niche) not found', (done) => {
      chai.request(app)
      .delete(`/api/users/${user._id}/closet/folders/123`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
    })

  })

  describe('POST /api/users/closet/folders/:folderId/products', () => {

    it('should return 500 and return an error', (done) => {
      // stub database connection
      sinon.stub(User, 'findOneAndUpdate')
      .callsFake(() => {
        return Promise.reject()
      })

      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders/${newFolder._id}/products`)
      .set('Authorization', validToken)
      .send(newProductId)
      .end((err, res) => {
        res.should.have.status(500)
        User.findOneAndUpdate.restore()
        done()
      })
    })

    it('should return 401 if token is not send', (done) => {
      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders/${newFolder._id}/products`)
      .send(newProductId)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 401 if token is invalid', (done) => {
      const invalidToken = '123abc'

      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders/${newFolder._id}/products`)
      .set('Authorization', invalidToken)
      .send(newProductId)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 200 and add a new product id in a folder', (done) => {
      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders/${defaultFolder._id}/products`)
      .set('Authorization', validToken)
      .send(newProductId)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        res.body.closet[0].should.have.property('_id')
        res.body.closet[0]._id.should.be.a('string')
        res.body.closet[0].should.have.property('folderName')
        res.body.closet[0].folderName.should.be.a('string')
        res.body.closet[0].should.have.property('products')
        res.body.closet[0].products.should.be.a('array')
        res.body.closet[0].should.have.property('description')
        res.body.closet[0].description.should.be.a('string')
        done()
      })
    })

    it('should return 400 if product id is invalid', (done) => {
      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders/${newFolder._id}/products`)
      .set('Authorization', validToken)
      .send({ "productId": '123' })
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
    })

    it('should return 422 if missing required property', (done) => {
      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders/${newFolder._id}/products`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 422 if product id is invalid format', (done) => {
      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders/${newFolder._id}/products`)
      .set('Authorization', validToken)
      .send({ "productId": 123 })
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 404 if folder (niche) not found', (done) => {
      chai.request(app)
      .post(`/api/users/${user._id}/closet/folders/123/products`)
      .set('Authorization', validToken)
      .send(newProductId)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
    })

  })

  describe('DELETE /api/users/:userId/closet/folders/:folderId/products/:productId', () => {

    it('should return 500 and return an error', (done) => {
      // stub database connection
      sinon.stub(User, 'findOneAndUpdate')
      .callsFake(() => {
        return Promise.reject()
      })

      chai.request(app)
      .delete(`/api/users/${user._id}/closet/folders/${defaultFolder._id}/products/${defaultProductId}`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(500)
        User.findOneAndUpdate.restore()
        done()
      })
    })

    it('should return 401 if token is not send', (done) => {
      chai.request(app)
      .delete(`/api/users/${user._id}/closet/folders/${defaultFolder._id}/products/${defaultProductId}`)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 401 if token is invalid', (done) => {
      const invalidToken = '123abc'

      chai.request(app)
      .delete(`/api/users/${user._id}/closet/folders/${defaultFolder._id}/products/${defaultProductId}`)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 200 and delete a product id from folder', (done) => {
      chai.request(app)
      .delete(`/api/users/${user._id}/closet/folders/${defaultFolder._id}/products/${defaultProductId}`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        res.body.closet[0].should.have.property('_id')
        res.body.closet[0]._id.should.be.a('string')
        res.body.closet[0].should.have.property('folderName')
        res.body.closet[0].folderName.should.be.a('string')
        res.body.closet[0].should.have.property('products')
        res.body.closet[0].products.should.be.a('array')
        res.body.closet[0].should.have.property('description')
        res.body.closet[0].description.should.be.a('string')
        done()
      })
    })

    it('should return 404 if folder (niche) not found', (done) => {
      chai.request(app)
      .delete(`/api/users/${user._id}/closet/folders/123/products/${defaultProductId}`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
    })

    it('should return 404 if product (niche) not found', (done) => {
      chai.request(app)
      .delete(`/api/users/${user._id}/closet/folders/${defaultFolder._id}/products/123`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
    })

  })
})
