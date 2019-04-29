import chai from 'chai'
import sinon from 'sinon'
import { app } from '/app'
import chaiHttp from 'chai-http'
import { ObjectID } from 'mongodb'
import User from '/src/models/user'
import Cloth from '/src/models/cloth'
import { products } from '/seeds/products'
import { user, validToken, userAdmin, validTokenAdmin } from '/seeds/users'
import UnclassifiedCloth from '/src/models/unclassifiedCloth'

const should = chai.should()
chai.use(chaiHttp)

describe('Admin', () => {

  beforeEach((done) => {
    UnclassifiedCloth.remove({})
    .then(() => {
      UnclassifiedCloth.insertMany(products)
      .then(() => {
        User.remove({}).then(() => {
          User.insertMany([user, userAdmin]).then(() => done())
        })
      })
    })
  })

  after((done) => {
    UnclassifiedCloth.remove({})
    .then(() => {
      User.remove({}).then(() => done())
    })
  })

  describe('GET /api/admin/unclassifiedClothes', () => {

    it('should return 401 if token is not provided', (done) => {
      chai.request(app)
      .get('/api/admin/unclassifiedClothes?offset=10')
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 403 if user dont have admin permission', (done) => {
      chai.request(app)
      .get('/api/admin/unclassifiedClothes?offset=10')
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(403)
        done()
      })
    })

    it('should return 422 if currentPage is not send', (done) => {
      chai.request(app)
      .get('/api/admin/unclassifiedClothes?offset=10')
      .set('Authorization', validTokenAdmin)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 422 if offset is not send', (done) => {
      chai.request(app)
      .get('/api/admin/unclassifiedClothes?currentPage=1')
      .set('Authorization', validTokenAdmin)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 500 if we cant get a mongodb connection', (done) => {
      // stub database connection
      sinon.stub(UnclassifiedCloth, 'find')
      .callsFake(() => {
        return Promise.reject()
      })

      chai.request(app)
      .get('/api/admin/unclassifiedClothes?currentPage=1&offset=10')
      .set('Authorization', validTokenAdmin)
      .end((err, res) => {
        res.should.have.status(500)
        UnclassifiedCloth.find.restore()
        done()
      })
    })

    it('should return 200 with pagination and unclassifiedProducts array', (done) => {
      chai.request(app)
      .get('/api/admin/unclassifiedClothes?currentPage=1&offset=10')
      .set('Authorization', validTokenAdmin)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('pagination')
        res.body.pagination.should.have.property('offset')
        res.body.pagination.offset.should.be.a('number')
        res.body.pagination.should.have.property('currentPage')
        res.body.pagination.currentPage.should.be.a('number')
        res.body.pagination.should.have.property('totalPages')
        res.body.pagination.totalPages.should.be.a('number')
        res.body.pagination.should.have.property('totalItems')
        res.body.pagination.totalItems.should.be.a('number')
        res.body.should.have.property('unclassifiedClothes')
        res.body.unclassifiedClothes.should.be.a('array')
        res.body.unclassifiedClothes.should.have.lengthOf(10)
        done()
      })
    })
  })

  describe('PUT /api/admin/unclassifiedClothes/:productId', () => {

    it('should return 401 if token is not provided', (done) => {
      const product = products[0]

      chai.request(app)
      .put(`/api/admin/unclassifiedClothes/${product._id}`)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it('should return 403 if user dont have admin permission', (done) => {
      chai.request(app)
      .get('/api/admin/unclassifiedClothes?offset=10')
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(403)
        done()
      })
    })

    it('should return 422 if moveToClothesCollection is missing', (done) => {
      const product = products[0]
      const { _id, ...body } = product

      chai.request(app)
      .put(`/api/admin/unclassifiedClothes/${product._id}`)
      .set('Authorization', validTokenAdmin)
      .send({ ...body, trackingUrl: '' })
      .end((err, res) => {
        res.should.have.status(422)
        res.body.should.have.property('validations')
        res.body.validations.should.have.property('body')
        res.body.validations.body.should.be.an('array')
        res.body.validations.body.should.have.length(1)
        res.body.validations.body[0].should.have.property('messages')
        res.body.validations.body[0].messages.should.have.length(1)
        res.body.validations.body[0].messages[0].should.be.equal('requires property "moveToClothesCollection"')
        done()
      })
    })

    it('should return 422 if trackingUrl is missing', (done) => {
      const product = products[0]
      const { _id, trackingUrl, ...body } = product

      chai.request(app)
      .put(`/api/admin/unclassifiedClothes/${product._id}`)
      .set('Authorization', validTokenAdmin)
      .send({ ...body, moveToClothesCollection: true })
      .end((err, res) => {
        res.should.have.status(422)
        res.body.should.have.property('validations')
        res.body.validations.should.have.property('body')
        res.body.validations.body.should.be.an('array')
        res.body.validations.body.should.have.length(1)
        res.body.validations.body[0].should.have.property('messages')
        res.body.validations.body[0].messages.should.have.length(1)
        res.body.validations.body[0].messages[0].should.be.equal('requires property "trackingUrl"')
        done()
      })
    })

    it('should return 422 if categories is missing', (done) => {
      const product = products[0]
      const { _id, categories, ...body } = product

      chai.request(app)
      .put(`/api/admin/unclassifiedClothes/${product._id}`)
      .set('Authorization', validTokenAdmin)
      .send({ ...body, moveToClothesCollection: true, trackingUrl: '' })
      .end((err, res) => {
        res.should.have.status(422)
        res.body.should.have.property('validations')
        res.body.validations.should.have.property('body')
        res.body.validations.body.should.be.an('array')
        res.body.validations.body.should.have.length(1)
        res.body.validations.body[0].should.have.property('messages')
        res.body.validations.body[0].messages.should.have.length(1)
        res.body.validations.body[0].messages[0].should.be.equal('requires property "categories"')
        done()
      })
    })

    it('should return 422 if categoriesOrigin is missing', (done) => {
      const product = products[0]
      const { _id, categoriesOrigin, ...body } = product

      chai.request(app)
      .put(`/api/admin/unclassifiedClothes/${product._id}`)
      .set('Authorization', validTokenAdmin)
      .send({ ...body, moveToClothesCollection: true, trackingUrl: '' })
      .end((err, res) => {
        res.should.have.status(422)
        res.body.should.have.property('validations')
        res.body.validations.should.have.property('body')
        res.body.validations.body.should.be.an('array')
        res.body.validations.body.should.have.length(1)
        res.body.validations.body[0].should.have.property('messages')
        res.body.validations.body[0].messages.should.have.length(1)
        res.body.validations.body[0].messages[0].should.be.equal('requires property "categoriesOrigin"')
        done()
      })
    })

    it('should return 200 and just update the product in the unclassifiedCollection', (done) => {
      const product = products[0]
      const { _id, productName,  ...body } = product

      chai.request(app)
      .put(`/api/admin/unclassifiedClothes/${product._id}`)
      .set('Authorization', validTokenAdmin)
      .send({
        ...body,
        productName: 'Updated Product',
        moveToClothesCollection: false,
        trackingUrl: 'https://www.google.com/'
      })
      .end(async (err, res) => {
        res.should.have.status(200)
        const updatedProduct = await UnclassifiedCloth.findOne({ _id: new ObjectID(product._id) })
        updatedProduct.should.not.be.null
        updatedProduct.should.not.be.undefined
        updatedProduct.should.have.property('productName')
        updatedProduct.productName.should.be.equal('Updated Product')
        updatedProduct.should.have.property('description')
        updatedProduct.should.have.property('title')
        updatedProduct.should.have.property('url')
        updatedProduct.should.have.property('gender')
        updatedProduct.should.have.property('price')
        updatedProduct.should.have.property('sizes')
        updatedProduct.should.have.property('image_medium_url')
        updatedProduct.should.have.property('images_urls')
        updatedProduct.should.have.property('disabled')
        updatedProduct.should.have.property('site')
        updatedProduct.should.have.property('brand')
        updatedProduct.should.have.property('trackingUrl')
        updatedProduct.should.have.property('categories')
        updatedProduct.should.have.property('categoriesOrigin')
        done()
      })
    })

    it('should return 200 remove the product from unclassifiedClothes, add to clothes with updated parameters', (done) => {
      const product = products[0]
      const { _id, productName,  ...body } = product

      chai.request(app)
      .put(`/api/admin/unclassifiedClothes/${product._id}`)
      .set('Authorization', validTokenAdmin)
      .send({
        ...body,
        productName: 'Updated and Moved Product',
        moveToClothesCollection: true,
        trackingUrl: 'https://www.google.com/'
      })
      .end(async (err, res) => {
        res.should.have.status(200)
        const removedProduct = await UnclassifiedCloth.findOne({ _id: new ObjectID(product._id) })
        should.not.exist(removedProduct)

        const upsertedProduct = await Cloth.findOne({ _id: new ObjectID(res.body._id) })
        should.exist(upsertedProduct)
        upsertedProduct.should.have.property('productName')
        upsertedProduct.productName.should.be.equal('Updated and Moved Product')
        upsertedProduct.should.have.property('description')
        upsertedProduct.should.have.property('title')
        upsertedProduct.should.have.property('url')
        upsertedProduct.should.have.property('gender')
        upsertedProduct.should.have.property('price')
        upsertedProduct.should.have.property('sizes')
        upsertedProduct.should.have.property('image_medium_url')
        upsertedProduct.should.have.property('images_urls')
        upsertedProduct.should.have.property('disabled')
        upsertedProduct.should.have.property('site')
        upsertedProduct.should.have.property('brand')
        upsertedProduct.should.have.property('trackingUrl')
        upsertedProduct.should.have.property('categories')
        upsertedProduct.should.have.property('categoriesOrigin')
        done()
      })
    })

  })
})
