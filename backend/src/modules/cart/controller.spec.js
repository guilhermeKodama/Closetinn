import chai from 'chai'
import cuid from 'cuid'
import sinon from 'sinon'
import { app } from '/app'
import chaiHttp from 'chai-http'
import { ObjectID } from 'mongodb'
import Cart from '/src/models/cart'
import User from '/src/models/user'
import Cloth from '/src/models/cloth'
import {
  cartValid
} from '/seeds/cart'
import {
  user,
  validToken,
} from '/seeds/users'
import { products } from '/seeds/products'

import { correios } from './utils'

const cartId = '5a107b81f32c59d2218de5ba'
const productId = cartValid.products[0]._id
const randomCartId = '5b38d7194fa9fc057e944743'
const randomId = cuid()

const carts = [
  { _id: new ObjectID(cartId),
    products: cartValid.products,
    user: new ObjectID(user._id.toString())
  },
  { _id: new ObjectID(randomCartId),
    products: cartValid.products,
    anonymousId: randomId
  }
]

const correiosResponse = [
  {
    Codigo: 41106,
    Valor: '32,30',
    PrazoEntrega: '26',
    ValorMaoPropria: '0,00',
    ValorAvisoRecebimento: '0,00',
    ValorValorDeclarado: '0,00',
    EntregaDomiciliar: 'S',
    EntregaSabado: 'N',
    Erro: '0',
    MsgErro: {},
    ValorSemAdicionais: '32,30',
    obsFim: {}
  }
]

const should = chai.should()
chai.use(chaiHttp)

describe('Cart', function () {
  this.timeout(10000)
  beforeEach((done) => {
    User.remove({}).then(() => {
      User.create(user).then(() => {
        Cloth.insertMany(products.slice(0, 10)).then(() => {
          Cart.insertMany(carts).then(() => done())
        })
      })
    })
  })

  afterEach((done) => {
    User.remove({}).then(() => {
      Cloth.remove({}).then(() => {
        Cart.remove({}).then(() => done())
      })
    })
  })

  describe('POST /api/cart', () => {
    it('should return 401 if anonymous doesnt send id', (done) => {
      chai.request(app)
      .post('/api/cart')
      .send({ })
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })
    it('should add cart of anonymous user', (done) => {
      chai.request(app)
      .post('/api/cart')
      .send({ anonymousId: cuid() })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.should.have.property('anonymousId')
        res.body.should.have.property('_id')
        done()
      })
    })
  })

  describe('POST /api/cart/:id/product', () => {
    it('should return 422 if extra attributes are sent in the body', (done) => {
      chai.request(app)
      .post(`/api/cart/${randomCartId}/product`)
      .send({ anonymousId: randomId, product: cartValid.products[0],  something: 'else' })
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })
    it('should return 401 if anonymous doesnt send id', (done) => {
      chai.request(app)
      .post(`/api/cart/${randomCartId}/product`)
      .send({ product: { ...cartValid.products[0], size: 'XGGG' } })
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })
    it('should add cloth to cart of anonymous user', (done) => {
      chai.request(app)
      .post(`/api/cart/${randomCartId}/product`)
      .send({ anonymousId: randomId, product: { ...cartValid.products[0], size: 'XGGG' } })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.products.should.have.length(4)
        res.body.products[res.body.products.length - 1].should.have.property('_id')
        res.body.products[res.body.products.length - 1].should.have.property('size')
        res.body.products[res.body.products.length - 1].should.have.property('quantity')
        res.body.should.have.property('anonymousId')
        res.body.should.have.property('_id')
        res.body.should.have.property('totalPrice')
        res.body.totalPrice.should.be.equal(339.93)
        res.body.should.have.property('totalProductsPrice')
        res.body.should.have.property('deliveryPrice')
        done()
      })
    })
    it('should add cloth to cart of logged user', (done) => {
      chai.request(app)
      .post(`/api/cart/${cartId}/product`)
      .set('Authorization', validToken)
      .send({ product: { ...cartValid.products[0], size: 'XGGG' } })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.products.should.have.length(4)
        res.body.products[res.body.products.length - 1].should.have.property('_id')
        res.body.products[res.body.products.length - 1].should.have.property('size')
        res.body.products[res.body.products.length - 1].should.have.property('quantity')
        res.body.should.have.property('user')
        res.body.should.have.property('_id')
        res.body.should.have.property('totalPrice')
        res.body.totalPrice.should.be.equal(339.93)
        res.body.should.have.property('totalProductsPrice')
        res.body.should.have.property('deliveryPrice')
        done()
      })
    })
    it('should return 200 and increase the quantity when product already exists', (done) => {
      chai.request(app)
      .post(`/api/cart/${cartId}/product`)
      .set('Authorization', validToken)
      .send({ product: cartValid.products[0] })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.products.should.have.length(3)
        res.body.products[res.body.products.length - 1].should.have.property('_id')
        res.body.products[res.body.products.length - 1].should.have.property('size')
        res.body.products[res.body.products.length - 1].should.have.property('quantity')
        res.body.products[res.body.products.length - 1].should.have.property('description')
        res.body.products[res.body.products.length - 1].should.have.property('url')
        res.body.products[res.body.products.length - 1].should.have.property('images_urls')
        res.body.products[res.body.products.length - 1].should.have.property('sizes')
        res.body.products[res.body.products.length - 1].quantity.should.be.equal(3)
        res.body.should.have.property('user')
        res.body.should.have.property('_id')
        done()
      })
    })
  })

  describe('GET /api/cart/:id', () => {
    it('should return 404 if no reference to the user is sent (logged or anonymous)', (done) => {
      chai.request(app)
      .get(`/api/cart/${'5b2a7b7e775bf23b83c82ce0'}`)
      .send({ product: cartValid.products[0] })
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
    })
    it('should get cart of anonymous user', (done) => {
      chai.request(app)
      .get(`/api/cart/${cartId}`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.products[0].should.have.property('_id')
        res.body.products[0].should.have.property('description')
        res.body.products[0].should.have.property('url')
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].should.have.property('quantity')
        res.body.products[0].should.have.property('size')
        res.body.products[0].should.have.property('sizes')
        res.body.should.have.property('_id')
        done()
      })
    })
    it('should add cloth to cart of logged user', (done) => {
      chai.request(app)
      .get(`/api/cart/${cartId}`)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.products[0].should.have.property('_id')
        res.body.products[0].should.have.property('description')
        res.body.products[0].should.have.property('url')
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].should.have.property('quantity')
        res.body.products[0].should.have.property('size')
        res.body.products[0].should.have.property('sizes')
        res.body.should.have.property('user')
        res.body.should.have.property('_id')
        done()
      })
    })
  })

  describe('PUT /api/cart/:id/product/:productId', () => {
    it('should return 404 if no reference to the user is sent (logged or anonymous)', (done) => {
      chai.request(app)
      .put(`/api/cart/${'5b2a7b7e775bf23b83c82ce0'}/product/${'5b2a7b7e775bf23b83c82ce0'}`)
      .send({ anonymousId: cuid(), product: { ...cartValid.products[0], quantity: 10, newSize: 'XGGGG' } })
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
    })
    it('should return 401 if anonymous doesnt send id', (done) => {
      chai.request(app)
      .put(`/api/cart/${cartId}/product/${productId}`)
      .send({ product: { ...cartValid.products[0], quantity: 10, newSize: 'XGGGG' } })
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })
    it('should update cloth to cart of anonymous user', (done) => {
      chai.request(app)
      .put(`/api/cart/${cartId}/product/${productId}`)
      .send({ anonymousId: cuid(), product: { ...cartValid.products[0], quantity: 10, newSize: 'XGGGG' } })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.should.have.property('_id')
        res.body.products[0].quantity.should.be.equal(10)
        res.body.products[0].size.should.be.equal('XGGGG')
        res.body.should.have.property('totalPrice')
        res.body.totalPrice.should.be.equal(659.85)
        res.body.should.have.property('totalProductsPrice')
        res.body.should.have.property('deliveryPrice')
        done()
      })
    })
    it('should add cloth to cart of logged user', (done) => {
      chai.request(app)
      .put(`/api/cart/${cartId}/product/${productId}`)
      .send({ product: { ...cartValid.products[0], quantity: 10, newSize: 'XGGGG' } })
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.should.have.property('user')
        res.body.should.have.property('_id')
        res.body.products[0].quantity.should.be.equal(10)
        res.body.products[0].size.should.be.equal('XGGGG')
        res.body.products[0].should.have.property('_id')
        res.body.products[0].should.have.property('description')
        res.body.products[0].should.have.property('url')
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].should.have.property('quantity')
        res.body.products[0].should.have.property('size')
        res.body.products[0].should.have.property('sizes')
        res.body.should.have.property('totalPrice')
        res.body.totalPrice.should.be.equal(659.85)
        res.body.should.have.property('totalProductsPrice')
        res.body.should.have.property('deliveryPrice')
        done()
      })
    })
  })
  describe('DELETE /api/cart/:id/product/:productId', () => {
    it('should return 404 if no reference to the user is sent (logged or anonymous)', (done) => {
      chai.request(app)
      .delete(`/api/cart/${'5b2a7b7e775bf23b83c82ce0'}/product/${'5b2a7b7e775bf23b83c82ce0'}`)
      .send({ anonymousId: cuid(), product: cartValid.products[0] })
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
    })
    it('should return 401 if anonymous doesnt send id', (done) => {
      chai.request(app)
      .delete(`/api/cart/${cartId}/product/${productId}`)
      .send({ product: cartValid.products[0] })
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })
    it('should delete cloth to cart of anonymous user', (done) => {
      chai.request(app)
      .delete(`/api/cart/${cartId}/product/${productId}`)
      .send({ anonymousId: cuid(), product: cartValid.products[0] })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.should.have.property('_id')
        res.body.products[0].should.have.property('_id')
        res.body.products[0].should.have.property('description')
        res.body.products[0].should.have.property('url')
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].should.have.property('quantity')
        res.body.products[0].should.have.property('size')
        res.body.products[0].should.have.property('sizes')
        res.body.products.should.have.length(2)
        res.body.should.have.property('totalPrice')
        res.body.totalPrice.should.be.equal(259.95)
        res.body.should.have.property('totalProductsPrice')
        res.body.should.have.property('deliveryPrice')
        done()
      })
    })
    it('should add cloth to cart of logged user', (done) => {
      chai.request(app)
      .delete(`/api/cart/${cartId}/product/${productId}`)
      .send({ product: cartValid.products[0] })
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.should.have.property('user')
        res.body.should.have.property('_id')
        res.body.products[0].should.have.property('_id')
        res.body.products[0].should.have.property('description')
        res.body.products[0].should.have.property('url')
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].should.have.property('quantity')
        res.body.products[0].should.have.property('size')
        res.body.products[0].should.have.property('sizes')
        res.body.products.should.have.length(2)
        res.body.should.have.property('totalPrice')
        res.body.totalPrice.should.be.equal(259.95)
        res.body.should.have.property('totalProductsPrice')
        res.body.should.have.property('deliveryPrice')
        done()
      })
    })
  })
  describe('UPDATE /api/cart/:id', () => {
    it('should return 404 if no reference to the user is sent (logged or anonymous)', (done) => {
      chai.request(app)
      .put(`/api/cart/${'5b2a7b7e775bf23b83c82ce0'}`)
      .send({ address: cartValid.address, creditCard: cartValid.creditCard })
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
    })
    it('should return 422 if not address or creditCard is sent', (done) => {
      chai.request(app)
      .put(`/api/cart/${'5b2a7b7e775bf23b83c82ce0'}`)
      .send({ products: [] })
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })
    it('should return 401 for anonymous user', (done) => {
      chai.request(app)
      .put(`/api/cart/${cartId}`)
      .send({ product: { ...cartValid.products[0], quantity: 10, size: 'XGGGG' } })
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })
    it('should add address and creditCard to cart of logged user', (done) => {
      chai.request(app)
      .put(`/api/cart/${'3123'}`)
      .send({ address: cartValid.address, creditCard: cartValid.creditCard })
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
    })

    it('should add address and creditCard to cart of logged user', (done) => {

      sinon.stub(correios, 'calcPrecoPrazo')
      .callsFake((args, cb) => {
        cb(null, correiosResponse)
      })

      chai.request(app)
      .put(`/api/cart/${cartId}`)
      .send({ address: cartValid.address, creditCard: cartValid.creditCard })
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('products')
        res.body.should.have.property('user')
        res.body.should.have.property('_id')
        res.body.should.have.property('address')
        res.body.should.have.property('creditCard')
        res.body.should.have.property('deliveryPrice')
        res.body.deliveryPrice.should.be.equal(32)
        res.body.should.have.property('deliveryTime')
        res.body.deliveryTime.should.be.equal('26')
        res.body.creditCard.should.have.property('number')
        res.body.creditCard.number.should.be.equal('**** **** **** 1111')
        res.body.products[0].should.have.property('_id')
        res.body.products[0].should.have.property('description')
        res.body.products[0].should.have.property('url')
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].should.have.property('quantity')
        res.body.products[0].should.have.property('size')
        res.body.products[0].should.have.property('sizes')
        done()
      })
    })
  })
})
