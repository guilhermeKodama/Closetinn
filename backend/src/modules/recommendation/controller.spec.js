import nock from 'nock'
import chai from 'chai'
import sinon from 'sinon'
import chaiHttp from 'chai-http'

import { app } from '/app'
import config from '/config'

import mongodb from '/src/utils/mongodb'

import Cloth from '/src/models/cloth'

import { products } from '/seeds/products'
import { recommendationProducts } from '/seeds/recommendationProducts'

const should = chai.should()
chai.use(chaiHttp)

describe('Recommendations', () => {

  before((done) => {
    Cloth.insertMany(products).then(() => { done() })
  })

  after((done) => {
    Cloth.remove({}).then(() => { done() })
  })

  describe('GET /api/recommendation/text/:productId', () => {
    it('should return 200 with recommendation for a determined product', (done) => {
      // mock request to ML api
      nock(config.mlAPI)
      .get('/recommendation/text/5a107b81f32c59d2218de5ba')
      .reply(200, recommendationProducts)

      chai.request(app)
      .get('/api/recommendation/text/5a107b81f32c59d2218de5ba')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.products.should.have.length(10)
        res.body.products[0].should.have.property('_id')
        res.body.products[0].should.have.property('categories')
        res.body.products[0].should.not.have.property('categoriesOrigin')
        res.body.products[0].should.have.property('description')
        res.body.products[0].should.not.have.property('disabled')
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].should.have.property('productName')
        res.body.products[0].should.have.property('title')
        res.body.products[0].should.have.property('url')
        done()
      })
    })

    it('should return 500 if cant get a connection with mongodb', (done) => {
      // mock request to ML api
      nock(config.mlAPI)
      .get('/recommendation/text/5a107b81f32c59d2218de5ba')
      .reply(500)

      // stub database connection
      sinon.stub(mongodb, 'getConnection')
      .callsFake((clName, cb) => {
        cb(new Error('Unable to get a connection'), null)
      })

      chai.request(app)
      .get('/api/recommendation/text/5a107b81f32c59d2218de5ba')
      .end((err, res) => {
        res.should.have.status(500)
        mongodb.getConnection.restore()
        done()
      })
    })

  })
})
