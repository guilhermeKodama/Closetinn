import chai from 'chai'
import sinon from 'sinon'
import chaiHttp from 'chai-http'

import { app } from '/app'
import config from '/config'

import mongodb from '/src/utils/mongodb'
import cloudinary from '/src/utils/cloudinary'

import User from '/src/models/user'
import Look from '/src/models/look'
import Cloth from '/src/models/cloth'

import { user, userAdmin, validToken, invalidToken, validTokenAdmin } from '/seeds/users'
import { looks, newLook } from '/seeds/looks'
import { productsPromotion } from '/seeds/products'

const should = chai.should()
chai.use(chaiHttp)

const lookImageName = 'look-test.jpg'
const lookImagePath = `${__dirname}/../../../seeds/looks/${lookImageName}`

describe('Looks', () => {

  beforeEach((done) => {
    User.remove({}).then(() => {
      User.insertMany([userAdmin]).then(() => {
        Cloth.insertMany(productsPromotion).then(() => {
          Look.insertMany(looks).then(() => { done() })
        })
      })
    })
  })

  afterEach((done) => {
    User.remove({}).then(() => {
      Look.remove({}).then(() => {
        Cloth.remove({}).then(() => { done() })
      })
    })
  })

  describe('GET /api/looks', () => {
    it('should return 401 if the user is not logged',  (done) => {
      chai.request(app)
      .get('/api/looks?offset=3')
      .set('Authorization', invalidToken)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 403 if user dont have admin permission', (done) => {
      chai.request(app)
      .get('/api/looks?offset=3')
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(403)
        done()
      })
    })

    it('should return 422 if page is not set', (done) => {
      chai.request(app)
      .get('/api/looks?offset=3')
      .set('Authorization', validTokenAdmin)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 422 if offset is not set ', (done) => {
      chai.request(app)
      .get('/api/looks?page=0')
      .set('Authorization', validTokenAdmin)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 200 and return a list of paginated looks', (done) => {
      const page = 0
      const offset = 3
      const productsLength = 3

      chai.request(app)
      .get(`/api/looks?page=${page}&offset=${offset}`)
      .set('Authorization', validTokenAdmin)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('looks')
        res.body.looks.should.be.a('array')
        res.body.looks.should.have.length(offset)
        res.body.looks[0].should.have.property('products')
        res.body.looks[0].products.should.be.a('array')
        res.body.looks[0].products.should.have.length(productsLength)
        res.body.looks[0].products[0].should.be.a('object')
        res.body.looks[0].should.have.property('_id')
        res.body.looks[0]._id.should.be.a('string')
        res.body.looks[0].should.have.property('image')
        res.body.looks[0].image.should.be.a('string')
        res.body.looks[0].should.have.property('createdAt')
        res.body.looks[0].createdAt.should.be.a('string')
        res.body.looks[0].should.have.property('updatedAt')
        res.body.looks[0].updatedAt.should.be.a('string')
        res.body.should.have.property('pagination')
        res.body.pagination.should.have.property('page')
        res.body.pagination.page.should.be.a('number')
        res.body.pagination.page.should.be.equal(page)
        res.body.pagination.should.have.property('offset')
        res.body.pagination.offset.should.be.a('number')
        res.body.pagination.offset.should.be.equal(offset)
        res.body.pagination.should.have.property('totalPages')
        res.body.pagination.totalPages.should.be.a('number')
        res.body.pagination.totalPages.should.be.equal(productsLength % offset === 0 ? productsLength / offset : (productsLength / offset) + 1 )
        res.body.pagination.should.have.property('totalItems')
        res.body.pagination.totalItems.should.be.a('number')
        res.body.pagination.totalItems.should.be.equal(productsLength)
        done()
      })
    })

  })

  describe('POST /api/looks', () => {
    after((done) => {
      Look.remove({}).then(() => { done() })
    })

    it('should return 401 if the user is not logged',  (done) => {
      chai.request(app)
      .post(`/api/looks`)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 403 if user dont have admin permission', (done) => {
      chai.request(app)
      .post(`/api/looks`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(403)
        done()
      })
    })

    it('should return 422 if products is not set ', (done) => {
      chai.request(app)
      .get('/api/looks')
      .set('Authorization', validTokenAdmin)
      .attach('image', lookImagePath, lookImageName)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 422 if image is not set ', (done) => {
      chai.request(app)
      .get('/api/looks')
      .set('Authorization', validTokenAdmin)
      .field('products', newLook.products)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 200 and create a look', (done) => {
      const productsLength = 3

      sinon.stub(cloudinary.v2.uploader, 'upload')
      .callsFake(() => Promise.resolve({ url: newLook.url }))

      chai.request(app)
      .post(`/api/looks`)
      .set('Authorization', validTokenAdmin)
      .set('Content-Type', 'multipart/form-data')
      .field('products', newLook.products)
      .attach('image', lookImagePath, lookImageName)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.products.should.be.a('array')
        res.body.products.should.have.length(productsLength)
        res.body.products[0].should.be.a('string')
        res.body.should.have.property('image')
        res.body.image.should.be.a('string')
        res.body.image.should.be.equal(newLook.url)
        sinon.stub.reset()
        done()
      })
    })

  })
})
