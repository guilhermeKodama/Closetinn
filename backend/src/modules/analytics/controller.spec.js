import chai from 'chai'
import cuid from 'cuid'
import sinon from 'sinon'
import { app } from '/app'
import chaiHttp from 'chai-http'
import { ObjectID } from 'mongodb'
import { view } from '/seeds/view'
import View from '/src/models/view'
import User from '/src/models/user'
import Click from '/src/models/click'
import { user } from '/seeds/users'
import mongoose from '/src/db/mongoose'

const should = chai.should()
chai.use(chaiHttp)

describe('Analytics', () => {
  beforeEach((done) => {
    User.remove({}).then(() => {
      User.insertMany([user]).then(() => {
        Click.remove({}).then(() => { done() })
      })
    })
  })

  afterEach((done) => {
    User.remove({}).then(() => {
      Click.remove({}).then(() => { done() })
    })
  })

  describe('Clicks', () => {
    describe('POST /api/analytics/clicks', () => {
      it('should return 422 on model validation', (done) => {
        chai.request(app)
        .post('/api/analytics/clicks')
        .end((err, res) => {
          res.should.have.status(422)
          Click.find({ user: user._id })
          .then((clicks) => {
            clicks.should.not.be.null
            done()
          })
        })
      })

      it('should return 200 and save click event', (done) => {
        chai.request(app)
        .post('/api/analytics/clicks')
        .send({ user: user._id, product: null, look: null, event: 'PRODUCT_CLICK'  })
        .end((err, res) => {
          res.should.have.status(200)
          Click.find({ user: user._id })
          .then((clicks) => {
            should.exist(clicks)
            clicks.should.have.length(1)
            clicks[0].should.have.property('_id')
            clicks[0].should.have.property('user')
            clicks[0].should.have.property('product')
            should.not.exist(clicks[0].product)
            clicks[0].should.have.property('look')
            should.not.exist(clicks[0].look)
            clicks[0].should.have.property('event')
            clicks[0].event.should.be.equal('PRODUCT_CLICK')
            clicks[0].should.have.property('createdAt')
            clicks[0].should.have.property('updatedAt')
            done()
          })
        })
      })
    })
  })

  describe('View', function () {
    describe('POST /api/analytics/pageView', () => {
      it('should return 422 if extra attributes are sent in the body', (done) => {
        chai.request(app)
        .post('/api/analytics/pageView')
        .send({ ...view,  something: 'else' })
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })

      it('should return 422 if missing attributes in the body', (done) => {
        chai.request(app)
        .post('/api/analytics/pageView')
        .send({ user: view.user })
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })

      it('should return 200 and add a new view', (done) => {
        chai.request(app)
        .post('/api/analytics/pageView')
        .send({ ...view })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('_id')
          res.body._id.should.be.a('string')
          res.body.should.have.property('user')
          res.body.user.should.be.a('string')
          res.body.user.should.be.equal(view.user)
          res.body.should.have.property('url')
          res.body.url.should.be.a('string')
          res.body.url.should.be.equal(view.url)
          res.body.should.have.property('createdAt')
          res.body.createdAt.should.be.a('string')
          res.body.should.have.property('updatedAt')
          res.body.updatedAt.should.be.a('string')
          done()
        })
      })
    })
  })
})
