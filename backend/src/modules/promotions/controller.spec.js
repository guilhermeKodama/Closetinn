import chai from 'chai'
import sinon from 'sinon'
import { app } from '/app'
import config from '/config'
import chaiHttp from 'chai-http'
import Cloth from '/src/models/cloth'
import Promotion from '/src/models/promotion'
import mongodb from '/src/utils/mongodb'
import { productsPromotion } from '/seeds/products'
import { promotions } from '/seeds/promotions'
const should = chai.should()
chai.use(chaiHttp)

describe('Promotions', () => {

  beforeEach((done) => {
    Cloth.insertMany(productsPromotion.slice(0, 10)).then(() => {
      Promotion.insertMany(promotions).then(() => {
        done()
      })
    })
  })

  afterEach((done) => {
    Cloth.remove({}).then(() => {
      Promotion.remove({}).then(() => {
        done()
      })
    })
  })

  describe('GET /api/promotions', () => {

    it('should return 200 and a list of promotions', (done) => {
      chai.request(app)
      .get('/api/promotions?currentPage=1&offset=10')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('pagination')
        res.body.should.have.property('promotions')
        res.body.promotions.should.be.an('array')
        res.body.promotions.should.have.length(1)
        res.body.promotions[0].should.have.property('_id')
        res.body.promotions[0].should.have.property('category')
        res.body.promotions[0].should.have.property('biggestDiscount')
        res.body.promotions[0].should.have.property('biggestDiscountCloth')
        res.body.promotions[0].should.have.property('lowestPrice')
        res.body.promotions[0].should.have.property('lowestPriceCloth')
        res.body.promotions[0].biggestDiscountCloth.should.have.property('_id')
        res.body.promotions[0].biggestDiscountCloth.should.have.property('productName')
        res.body.promotions[0].biggestDiscountCloth.should.have.property('price')
        res.body.promotions[0].biggestDiscountCloth.should.have.property('priceDiscount')
        res.body.promotions[0].biggestDiscountCloth.should.have.property('priceOld')
        res.body.promotions[0].biggestDiscountCloth.should.have.property('image_medium_url')
        res.body.promotions[0].biggestDiscountCloth.should.have.property('images_urls')
        done()
      })
    })

    it('should return 422 if currentPage or offset is not sent', (done) => {
      chai.request(app)
      .get('/api/promotions')
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })
  })

  describe('GET /api/promotions/:id', () => {

    it('should return 200 and a list of promotions', (done) => {
      chai.request(app)
      .get('/api/promotions/5b6cd04d0a3da6be561647aa?currentPage=1&offset=10')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('_id')
        res.body.should.have.property('filters')
        res.body.should.have.property('pagination')
        res.body.should.have.property('category')
        res.body.should.have.property('clothes')
        res.body.clothes.should.be.an('array')
        res.body.clothes.should.have.length(3)
        res.body.clothes[0].should.have.property('_id')
        res.body.clothes[0].should.have.property('_id')
        res.body.clothes[0].should.have.property('productName')
        res.body.clothes[0].should.have.property('price')
        res.body.clothes[0].should.have.property('priceDiscount')
        res.body.clothes[0].should.have.property('priceOld')
        res.body.clothes[0].should.have.property('image_medium_url')
        res.body.clothes[0].should.have.property('images_urls')
        res.body.should.have.property('biggestDiscount')
        res.body.should.have.property('biggestDiscountCloth')
        res.body.should.have.property('lowestPrice')
        res.body.should.have.property('lowestPriceCloth')
        res.body.biggestDiscountCloth.should.have.property('_id')
        res.body.biggestDiscountCloth.should.have.property('productName')
        res.body.biggestDiscountCloth.should.have.property('price')
        res.body.biggestDiscountCloth.should.have.property('priceDiscount')
        res.body.biggestDiscountCloth.should.have.property('priceOld')
        res.body.biggestDiscountCloth.should.have.property('image_medium_url')
        res.body.biggestDiscountCloth.should.have.property('images_urls')
        done()
      })
    })

    it('should return 422 if currentPage or offset is not sent', (done) => {
      chai.request(app)
      .get('/api/promotions/5b6cd04d0a3da6be561647aa')
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })
  })
})
