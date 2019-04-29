import nock from 'nock'
import chai from 'chai'
import sinon from 'sinon'
import chaiHttp from 'chai-http'

import { app } from '/app'
import config from '/config'

import mongodb from '/src/utils/mongodb'

import Cloth from '/src/models/cloth'

import { products } from '/seeds/products'
import { searchProducts } from '/seeds/searchProducts'

const should = chai.should()
chai.use(chaiHttp)

describe('Search', () => {

  before((done) => {
    Cloth.insertMany(products).then(() => { done() })
  })

  after((done) => {
    Cloth.remove({}).then(() => { done() })
  })

  describe('GET /api/search', () => {
    it('should return 200 with a product list', (done) => {
      // mock request to ML graph api
      nock(config.mlAPI)
      .get('/search?query=camisa%20polo')
      .reply(200, searchProducts)

      chai.request(app)
      .get('/api/search?query=camisa%20polo')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.products[0].should.have.property('_id')
        res.body.products[0].should.have.property('categories')
        res.body.products[0].should.have.property('description')
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].should.have.property('productName')
        res.body.products[0].should.have.property('title')
        res.body.products[0].should.have.property('url')
        done()
      })
    })

    it('should return 422 missing params', (done) => {
      chai.request(app)
      .get('/api/search?')
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

  })
})
