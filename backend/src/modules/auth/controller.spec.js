import cuid from 'cuid'
import nock from 'nock'
import chai from 'chai'
import sinon from 'sinon'
import async from 'async'
import { app } from '/app'
import config from '/config'
import chaiHttp from 'chai-http'
import email from '../../utils/email'
import mongodb from '/src/utils/mongodb'
import security from '../../utils/security'
import User from '/src/models/user'
import Cart from '/src/models/cart'
import Cloth from '/src/models/cloth'
import {
  userAdmin,
  user,
  userNoCart,
  userHasCart,
  newUser,
  userFacebook,
  newUserFacebook,
  validToken,
  validTokenAdmin,
  validTokenFacebook,
  invalidCreateFacebookUserTestCases
} from '/seeds/users'

import {
  unknownUser,
  invalidToken,
  expiredToken,
  invalidAuthFacebookUserTestCases
} from '/seeds/auth'

import {
  cartValid
} from '/seeds/cart'

import { products } from '/seeds/products'

const should = chai.should()
chai.use(chaiHttp)

const anonymousId = cuid()

describe('Auth', () => {

  beforeEach((done) => {
    User.remove({}).then(() => {
      User.insertMany([userAdmin, user, userFacebook, userNoCart, userHasCart]).then(() => {
        Cloth.remove({}).then(() => {
          Cloth.insertMany(products.slice(0, 10)).then(() => {
            Cart.insertMany([
              { user: userHasCart._id, products: [ cartValid.products[0], { _id: products[4]._id, size: 'XGGG', quantity: 1 }  ]},
              { products: cartValid.products, anonymousId }
            ]).then(() => {
              done()
            })
          })
        })
      })
    })
  })

  afterEach((done) => {
    User.remove({}).then(() => {
      Cloth.remove({}).then(() => {
        Cart.remove({}).then(() => {
          done()
        })
      })
    })
  })


  describe('POST /api/auth/unknown', () => {

    it('should return 200 and a valid token', (done) => {
      chai.request(app)
      .post('/api/auth/unknown')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('token')
        done()
      })
    })

  })

  describe('POST /api/auth', () => {

    it('should return 422 if necessary attrs are not sent', (done) => {
      chai.request(app)
      .post(`/api/auth`)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 404 if user dont exist', (done) => {
      chai.request(app)
      .post('/api/auth')
      .send({ ...unknownUser, anonymousId: cuid() })
      .end((err, res) => {
        res.should.have.status(404)
        res.body.should.have.property('message')
        res.body.message.should.be.a('string')
        res.body.message.should.be.deep.equal("User not found")
        done()
      })
    })

    it('should return 401 if facebook user tries to login with email/password', (done) => {
      chai.request(app)
      .post('/api/auth')
      .send({ email: userFacebook.email, password: '123456', anonymousId: cuid() })
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    // no one has cart
    it('should return 200 and create a new cart (no one has cart)', (done) => {
      const { name, email, password } = user
      chai.request(app)
      .post('/api/auth')
      .send({ name, email, password: '123456', anonymousId: cuid() })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('token')
        res.body.should.have.property('_id')
        res.body._id.should.be.a('string')
        res.body.should.have.property('email')
        res.body.email.should.be.a('string')
        res.body.should.have.property('name')
        res.body.name.should.be.a('string')
        res.body.should.have.property('role')
        res.body.role.should.be.a('string')
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        res.body.should.have.property('cart')
        res.body.cart.products.should.have.length(0)
        done()
      })
    })

    // only anonymous has cart
    it('should return 200 and transfer anonymous cart to user without cart', (done) => {
      const { name, email, password } = userNoCart
      chai.request(app)
      .post('/api/auth')
      .send({ name, email, password: '123456', anonymousId })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('token')
        res.body.should.have.property('_id')
        res.body._id.should.be.a('string')
        res.body.should.have.property('email')
        res.body.email.should.be.a('string')
        res.body.should.have.property('name')
        res.body.name.should.be.a('string')
        res.body.should.have.property('role')
        res.body.role.should.be.a('string')
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        res.body.should.have.property('cart')
        res.body.cart.products.should.have.length(3)
        done()
      })
    })

    // only user has cart
    it('should return 200 and return the user cart (anonymous dont have cart)', (done) => {
      const { name, email, password } = userHasCart
      chai.request(app)
      .post('/api/auth')
      .send({ name, email, password: '123456', anonymousId: cuid() })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('token')
        res.body.should.have.property('_id')
        res.body._id.should.be.a('string')
        res.body.should.have.property('email')
        res.body.email.should.be.a('string')
        res.body.should.have.property('name')
        res.body.name.should.be.a('string')
        res.body.should.have.property('role')
        res.body.role.should.be.a('string')
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        res.body.should.have.property('cart')
        res.body.cart.products.should.have.length(2)
        done()
      })
    })

    // both have carts
    it('should return 200 merge carts', (done) => {
      const { name, email, password } = userHasCart
      chai.request(app)
      .post('/api/auth')
      .send({ name, email, password: '123456', anonymousId })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('token')
        res.body.should.have.property('_id')
        res.body._id.should.be.a('string')
        res.body.should.have.property('email')
        res.body.email.should.be.a('string')
        res.body.should.have.property('name')
        res.body.name.should.be.a('string')
        res.body.should.have.property('role')
        res.body.role.should.be.a('string')
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        res.body.should.have.property('cart')
        res.body.cart.products.should.have.length(4)
        res.body.cart.products[0].should.have.property('productName')
        res.body.cart.products[0].should.have.property('categories')
        res.body.cart.products[0].should.have.property('images_urls')
        res.body.cart.products[0].quantity.should.be.equal(2)
        done()
      })
    })

    describe('schema', () => {

      it('should return 422 if email is not sent', (done) => {
        chai.request(app)
        .post('/api/auth')
        .send({ password: '123456', anonymousId: cuid() })
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })

      it('should return 422 if password is not sent', (done) => {
        chai.request(app)
        .post('/api/auth')
        .send({ email: newUser.email, anonymousId: cuid() })
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })

      it('should return 422 if anonymousId is not sent', (done) => {
        chai.request(app)
        .post('/api/auth')
        .send({ email: newUser.email, password: '123456' })
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })

    })
  })

  describe('POST /api/auth/forgot', () => {

    it('should return 422 if email is not send', (done) => {
      chai.request(app)
      .post('/api/auth/forgot')
      .send({})
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should throw 404 if user dont exit', (done) => {
      chai.request(app)
      .post('/api/auth/forgot')
      .send({ email: 'teste@gmail.com'})
      .end((err, res) => {
        res.should.have.status(404)
        res.body.should.have.property('message')
        res.body.message.should.be.a('string')
        res.body.message.should.be.deep.equal("User not found.")
        done()
      })
    })

    it('should return 200 and send an email with a valid token if user exists',(done) => {
      sinon.stub(email, 'sendEmail')
      .callsFake((options, cb) => { cb(null, {}) })

      chai.request(app)
      .post('/api/auth/forgot')
      .send({ email: user.email})
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
    })

  })

  describe('POST /auth/forgot/validate', () => {

    it('should return 422 if token is not send', (done) => {
      chai.request(app)
      .post('/api/auth/forgot/validate')
      .send({})
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 401 if token is not valid', (done) => {
      chai.request(app)
      .post('/api/auth/forgot/validate')
      .send({ token: invalidToken })
      .end((err, res) => {
        res.should.have.status(401)
        res.body.should.have.property('message')
        res.body.message.should.be.a('string')
        res.body.message.should.be.deep.equal("Token is not valid!")
        done()
      })
    })

    it('should throw 404 if token is valid but user dont exist', (done) => {
      const validToken = security.generateForgotPasswordToken({ email: 'teste@gmail.com' })

      chai.request(app)
      .post('/api/auth/forgot/validate')
      .send({ token: validToken })
      .end((err, res) => {
        res.should.have.status(404)
        res.body.should.have.property('message')
        res.body.message.should.be.a('string')
        res.body.message.should.be.deep.equal("User not found.")
        done()
      })
    })

  })

  describe('POST /api/auth/facebook', () => {

    it('should return 422 if send wrong attrs', (done) => {
      chai.request(app)
      .post(`/api/auth/facebook`)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 422 if invalid body is sent', (done) => {
      async.each(invalidCreateFacebookUserTestCases,
      (data, cb) => {
        chai.request(app)
        .post('/api/auth/facebook')
        .send(data)
        .end((err, res) => {
          res.should.have.status(422)
          cb()
        })
      }, (err) => {
        if(err) return done(err)
        done()
      })
    })

    it('should return 400 facebookToken is invalid', (done) => {
      // mock request to facebook graph api
      nock(config.facebookAPI)
      .get('/debug_token?input_token=123123&access_token=1557384474356665%7CjJXKWOeYqEPpSYKrP8o9hqT9p-o')
      .reply(400, '{"data":{ "error": "Invalid Token" }}')

      const { _id, ...body } = userFacebook
      chai.request(app)
      .post('/api/auth/facebook')
      .send(body)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.have.property('message')
        done()
      })
    })

    it('should return 200 and update user if user already exist',(done) => {
      // mock request to facebook graph api
      nock(config.facebookAPI)
      .get('/debug_token?input_token=123123&access_token=1557384474356665%7CjJXKWOeYqEPpSYKrP8o9hqT9p-o')
      .reply(200, '{"data":{}}')

      const { _id, ...body } = userFacebook
      chai.request(app)
      .post('/api/auth/facebook')
      .send(body)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('_id')
        res.body._id.should.be.a('string')
        res.body.should.have.property('email')
        res.body.email.should.be.a('string')
        res.body.should.have.property('token')
        res.body.token.should.be.a('string')
        res.body.should.have.property('name')
        res.body.name.should.be.a('string')
        res.body.should.have.property('role')
        res.body.role.should.be.a('string')
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        res.body.should.have.property('facebookPicture')
        done()
      })
    })

    it('should return 200 if user is saved in the database and retrieve info', (done) => {
      // mock request to facebook graph api
      nock(config.facebookAPI)
      .get('/debug_token?input_token=123123&access_token=1557384474356665%7CjJXKWOeYqEPpSYKrP8o9hqT9p-o')
      .reply(200, '{"data":{}}')

      const { _id, ...body } = userFacebook
      chai.request(app)
      .post('/api/auth/facebook')
      .send(body)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('_id')
        res.body._id.should.be.a('string')
        res.body.should.have.property('token')
        res.body.token.should.be.a('string')
        res.body.should.have.property('name')
        res.body.name.should.be.a('string')
        res.body.should.have.property('role')
        res.body.role.should.be.a('string')
        res.body.should.have.property('email')
        res.body.email.should.be.a('string')
        res.body.should.have.property('closet')
        res.body.closet.should.be.a('array')
        res.body.should.have.property('facebookPicture')
        done()
      })
    })
  })

  describe('POST /auth/admin/validate', () => {

    it('should return 422 if token is not send', (done) => {
      chai.request(app)
      .post('/api/auth/admin/validate')
      .send({})
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 401 if token is not valid', (done) => {
      chai.request(app)
      .post('/api/auth/admin/validate')
      .send({ token: invalidToken })
      .end((err, res) => {
        res.should.have.status(401)
        res.body.should.have.property('message')
        res.body.message.should.be.a('string')
        res.body.message.should.be.deep.equal("Token is not valid!")
        done()
      })
    })

    it('should throw 404 if token is valid but user dont exist', (done) => {
      const validToken = security.generateForgotPasswordToken({ email: 'teste@gmail.com' })

      chai.request(app)
      .post('/api/auth/admin/validate')
      .send({ token: validToken })
      .end((err, res) => {
        res.should.have.status(404)
        res.body.should.have.property('message')
        res.body.message.should.be.a('string')
        res.body.message.should.be.deep.equal("User not found.")
        done()
      })
    })

    it('should return 403 if token doesnt have admin permissions', (done) => {
      chai.request(app)
      .post('/api/auth/admin/validate')
      .send({ token: validTokenFacebook })
      .end((err, res) => {
        res.should.have.status(403)
        res.body.should.have.property('message')
        res.body.message.should.be.a('string')
        res.body.message.should.be.deep.equal("User dont have admin permissions")
        done()
      })
    })

    it('should return 200 if is a valid admin', (done) => {
      chai.request(app)
      .post('/api/auth/admin/validate')
      .send({ token: validTokenAdmin })
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
    })
  })
  describe('POST /auth/email', () => {
    it('should return 401 if token is not provided', (done) => {
      chai.request(app)
      .post('/api/auth/email')
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 403 if user dont have admin permission', (done) => {
      chai.request(app)
      .post('/api/auth/email')
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(403)
        done()
      })
    })

    it('should return 200 with users tokens', (done) => {
      chai.request(app)
      .post('/api/auth/email')
      .set('Authorization', validTokenAdmin)
      .send({ emails: [user.email, userFacebook.email] })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('tokens')
        res.body.tokens.should.have.property('guilherme.kodam1a@gmail.com')
        res.body.tokens.should.have.property('guilherme.kodama.facebook@gmail.com')
        done()
      })
    })
  })
})
