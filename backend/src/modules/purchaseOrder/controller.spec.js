import chai from 'chai'
import nock from 'nock'
import sinon from 'sinon'
import { app } from '/app'
import config from '/config'
import chaiHttp from 'chai-http'
import { ObjectID } from 'mongodb'
import User from '/src/models/user'
import mongodb from '/src/utils/mongodb'
import PurchaseOrder from '/src/models/purchaseOrder'
import {
  user,
  userAdmin,
  validToken,
  userFacebook,
  invalidToken,
  validTokenAdmin,
  validTokenFacebook
} from '/seeds/users'
import {
  purchaseOrderValid,
  purchaseOrderMissingName,
  purchaseOrderMissingProducts,
  purchaseOrderMissingAddress,
  purchaseOrderMissingCreditCard } from '/seeds/purchaseOrders'
const should = chai.should()
chai.use(chaiHttp)

const poID = '5b2ae55f9a63f66a8786a9c3'

describe('PurchaseOrder', () => {
  beforeEach((done) => {
    User.remove({}).then(() => {
      User.insertMany([user, userFacebook, userAdmin]).then(() => {
        PurchaseOrder.create({ _id: new ObjectID(poID), user: user._id.toString(), jobId: 100, ...purchaseOrderValid})
        .then(() => done())
      })
    })
  })

  afterEach((done) => {
    User.remove({}).then(() => {
      PurchaseOrder.remove({}).then(() => done())
    })
  })
  describe('POST /api/purchaseOrders', () => {

    it('should return 422 if missing products',  (done) => {
      chai.request(app)
      .post('/api/purchaseOrders')
      .set('Authorization', validToken)
      .send(purchaseOrderMissingProducts)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 422 if missing address',  (done) => {
      chai.request(app)
      .post('/api/purchaseOrders')
      .set('Authorization', validToken)
      .send(purchaseOrderMissingAddress)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 422 if missing address',  (done) => {
      chai.request(app)
      .post('/api/purchaseOrders')
      .set('Authorization', validToken)
      .send(purchaseOrderMissingCreditCard)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 401 if the user is not logged',  (done) => {
      chai.request(app)
      .post('/api/purchaseOrders')
      .set('Authorization', invalidToken)
      .send(purchaseOrderMissingCreditCard)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it.skip('should return 200 and save the PO if the schema is valid', (done) => {
      nock(config.queueAPI)
      .post('/job')
      .reply(200, { message: 'job created', id: 15})

      chai.request(app)
      .post('/api/purchaseOrders')
      .set('Authorization', validToken)
      .send(purchaseOrderValid)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('user')
        res.body.user.should.be.a('string')
        res.body.should.have.property('address')
        res.body.address.should.be.an('object')
        res.body.should.have.property('products')
        res.body.products.should.be.an('array')
        res.body.should.have.property('creditCard')
        res.body.creditCard.number.should.be.equal('**** **** **** 1111')
        res.body.creditCard.should.be.an('object')
        res.body.should.have.property('jobId')
        done()
      })
    })
  })
  describe('GET /api/purchaseOrders', () => {
    it('should return 401 if token is invalid',  (done) => {
      chai.request(app)
      .get('/api/purchaseOrders')
      .set('Authorization', invalidToken)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })
    it('should return 401 if token is missing',  (done) => {
      chai.request(app)
      .get('/api/purchaseOrders')
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })
    it.skip('should return 200 and return all the POs related to that user', (done) => {

      chai.request(app)
      .get('/api/purchaseOrders')
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('purchaseOrders')
        res.body.purchaseOrders.should.be.an('array')
        res.body.purchaseOrders.should.have.length(1)
        res.body.purchaseOrders[0].should.have.property('_id')
        res.body.purchaseOrders[0].should.have.property('products')
        res.body.purchaseOrders[0].should.have.property('creditCard')
        res.body.purchaseOrders[0].creditCard.number.should.be.equal('**** **** **** 1111')
        res.body.purchaseOrders[0].should.have.property('address')
        res.body.purchaseOrders[0].should.have.property('status')
        res.body.purchaseOrders[0].should.have.property('createdAt')
        res.body.purchaseOrders[0].should.have.property('updatedAt')
        done()
      })
    })
  })
  describe('PUT /api/purchaseOrders/:id/cancel', () => {
    it('should return 401 if token is invalid',  (done) => {
      chai.request(app)
      .put(`/api/purchaseOrders/${poID}/cancel`)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })
    it('should return 401 if token is missing',  (done) => {
      chai.request(app)
      .put(`/api/purchaseOrders/${poID}/cancel`)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })
    it('should return 403 if po dont belong to authenticated user',  (done) => {
      chai.request(app)
      .put(`/api/purchaseOrders/${poID}/cancel`)
      .set('Authorization', validTokenFacebook)
      .end((err, res) => {
        res.should.have.status(403)
        done()
      })
    })
    it.skip('should return 200 and alter the status if user is admin',  (done) => {
      nock(config.queueAPI)
      .delete(`/job/${100}`)
      .reply(200, { message: 'job 100 removed' })

      chai.request(app)
      .put(`/api/purchaseOrders/${poID}/cancel`)
      .set('Authorization', validTokenAdmin)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('user')
        res.body.user.should.be.a('string')
        res.body.should.have.property('address')
        res.body.address.should.be.an('object')
        res.body.should.have.property('products')
        res.body.products.should.be.an('array')
        res.body.should.have.property('creditCard')
        res.body.creditCard.number.should.be.equal('**** **** **** 1111')
        res.body.creditCard.should.be.an('object')
        res.body.should.have.property('jobId')
        res.body.should.have.property('status')
        res.body.status.should.be.equal('cancel')
        done()
      })
    })
    it.skip('should return 200 and alter the status if po belongs to regular user',  (done) => {
      nock(config.queueAPI)
      .delete(`/job/${100}`)
      .reply(200, { message: 'job 100 removed' })

      chai.request(app)
      .put(`/api/purchaseOrders/${poID}/cancel`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('user')
        res.body.user.should.be.a('string')
        res.body.should.have.property('address')
        res.body.address.should.be.an('object')
        res.body.should.have.property('products')
        res.body.products.should.be.an('array')
        res.body.should.have.property('creditCard')
        res.body.creditCard.number.should.be.equal('**** **** **** 1111')
        res.body.creditCard.should.be.an('object')
        res.body.should.have.property('jobId')
        res.body.should.have.property('status')
        res.body.status.should.be.equal('cancel')
        done()
      })
    })
  })
})
