import chai from 'chai'
import sinon from 'sinon'
import { app } from '/app'
import config from '/config'
import chaiHttp from 'chai-http'
import Cloth from '/src/models/cloth'
import mongodb from '/src/utils/mongodb'
import { products } from '/seeds/products'
const should = chai.should()
chai.use(chaiHttp)

describe.skip('Clothes', () => {

  before((done) => {
    mongodb.getConnection(config.mongodb.clothesCollection, (errConn, cl) => {
      cl.insertMany(products, function(err, r) {
        done()
      })
    })
  })

  after((done) => {
    mongodb.getConnection(config.mongodb.clothesCollection, (errConn, cl) => {
      cl.deleteMany({}, function(err, r) {
        done()
      })
    })
  })

  describe('GET /api/products', () => {
    it('should return 500 if cant get a connection with mongodb', (done) => {
      // stub database connection
      sinon.stub(mongodb, 'getConnection')
      .callsFake((clName, cb) => {
        cb(new Error('Unable to get a connection'), null)
      })

      chai.request(app)
      .get('/api/products?currentPage=1&offset=20&parentCategory=Roupas')
      .end((err, res) => {
        res.should.have.status(500)
        mongodb.getConnection.restore()
        done()
      })
    })

    it('should return 200 and a list of products', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('pagination')
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
        res.body.products[0].should.have.property('trackingUrl')
        done()
      })
    })

    it('should return 422 if currentPage is not set', (done) => {
      chai.request(app)
      .get('/api/products?offset=10&parentCategory=Roupas')
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 422 if offset is not set ', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&parentCategory=Roupas')
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 422 if parentCategory is not set', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10')
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 422 if a strange param is set', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&randomParam=random')
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 422 a non json array is set in sites', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&sites=Something')
      .end((err, res) => {
        res.should.have.status(422)
        chai.request(app)
        .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&sites=[Something, Something2]')
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })
    })

    it('should return 422 a non json array is set in sizes', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&sizes=Something')
      .end((err, res) => {
        res.should.have.status(422)
        chai.request(app)
        .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&sizes=[Something, Something2]')
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })
    })

    it('should return 422 a non json array is set in brands', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&brands=Something')
      .end((err, res) => {
        res.should.have.status(422)
        chai.request(app)
        .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&brands=[Something, Something2]')
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })
    })

    it('should return 422 a non json array is set in genders', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&brand=Colcci&genders=Something')
      .end((err, res) => {
        res.should.have.status(422)
        chai.request(app)
        .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&brand=Colcci&genders=[Something, Something2]')
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })
    })

    it('should return 422 if priceMin is greater than priceMax', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&priceMin=100&priceMax=10')
      .end((err, res) => {
        res.should.have.status(422)
        res.body.error.should.be.equal('Min price should be lower than max price')
        done()
      })
    })

    it('should return 200 and filter by brand', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&brands=["Colcci"]')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('pagination')
        res.body.should.have.property('products')
        res.body.products.should.have.length(5)
        res.body.products[0].should.have.property('_id')
        res.body.products[0]._id.should.be.a('string')
        res.body.products[0].should.have.property('url')
        res.body.products[0].url.should.be.a('string')
        res.body.products[0].should.have.property('title')
        res.body.products[0].title.should.be.a('string')
        res.body.products[0].should.have.property('brand')
        res.body.products[0].brand.should.be.a('string')
        res.body.products[0].brand.should.be.equal('colcci')
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].images_urls.should.be.a('array')
        res.body.products[0].should.have.property('categories')
        res.body.products[0].categories.should.be.a('array')
        res.body.products[0].should.have.property('description')
        res.body.products[0].description.should.be.a('string')
        res.body.products[0].should.have.property('productName')
        res.body.products[0].productName.should.be.a('string')
        res.body.products[0].should.not.have.property('disabled')
        res.body.products[0].should.not.have.property('categoriesOrigin')
        res.body.products[0].should.have.property('trackingUrl')
        done()
      })
    })

    it('should return 200 and filter by price range', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&priceMin=10&priceMax=100')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('pagination')
        res.body.should.have.property('products')
        res.body.products.should.have.length(10)
        res.body.products[0].should.have.property('_id')
        res.body.products[0]._id.should.be.a('string')
        res.body.products[0].should.have.property('url')
        res.body.products[0].url.should.be.a('string')
        res.body.products[0].should.have.property('title')
        res.body.products[0].title.should.be.a('string')
        res.body.products[0].should.have.property('brand')
        res.body.products[0].brand && res.body.products[0].brand.should.be.a('string')
        res.body.products[0].should.have.property('price')
        res.body.products[0].price.should.be.a('number')
        res.body.products[0].price.should.be.equal(49.99)
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].images_urls.should.be.a('array')
        res.body.products[0].should.have.property('categories')
        res.body.products[0].categories.should.be.a('array')
        res.body.products[0].should.have.property('description')
        res.body.products[0].description.should.be.a('string')
        res.body.products[0].should.have.property('productName')
        res.body.products[0].productName.should.be.a('string')
        res.body.products[0].should.not.have.property('disabled')
        res.body.products[0].should.not.have.property('categoriesOrigin')
        res.body.products[0].should.have.property('trackingUrl')

        // check if every price in inside the range
        for(let i = 0; i < res.body.products.length; i++) {
          res.body.products[i].price.should.be.above(10)
          res.body.products[i].price.should.be.below(100)
        }

        done()
      })
    })

    it('should return 200 and filter by sizes', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&sizes=["40", "42"]')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('pagination')
        res.body.should.have.property('products')
        res.body.products.should.have.length(10)
        res.body.products[0].should.have.property('_id')
        res.body.products[0]._id.should.be.a('string')
        res.body.products[0].should.have.property('url')
        res.body.products[0].url.should.be.a('string')
        res.body.products[0].should.have.property('title')
        res.body.products[0].title.should.be.a('string')
        res.body.products[0].should.have.property('brand')
        res.body.products[0].brand && res.body.products[0].brand.should.be.a('string')
        res.body.products[0].should.have.property('price')
        res.body.products[0].price.should.be.a('number')
        res.body.products[0].should.have.property('sizes')
        res.body.products[0].sizes.should.be.a('array')
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].images_urls.should.be.a('array')
        res.body.products[0].should.have.property('categories')
        res.body.products[0].categories.should.be.a('array')
        res.body.products[0].should.have.property('description')
        res.body.products[0].description.should.be.a('string')
        res.body.products[0].should.have.property('productName')
        res.body.products[0].productName.should.be.a('string')
        res.body.products[0].should.not.have.property('disabled')
        res.body.products[0].should.not.have.property('categoriesOrigin')
        res.body.products[0].should.have.property('trackingUrl')
        done()
      })
    })

    it('should return 200 and filter by site', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&sites=["dafiti"]')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('pagination')
        res.body.should.have.property('products')
        res.body.products.should.have.length(10)
        res.body.products[0].should.have.property('_id')
        res.body.products[0]._id.should.be.a('string')
        res.body.products[0].should.have.property('url')
        res.body.products[0].url.should.be.a('string')
        res.body.products[0].should.have.property('title')
        res.body.products[0].title.should.be.a('string')
        res.body.products[0].should.have.property('brand')
        res.body.products[0].brand && res.body.products[0].brand.should.be.a('string')
        res.body.products[0].should.have.property('price')
        res.body.products[0].price.should.be.a('number')
        res.body.products[0].should.have.property('sizes')
        res.body.products[0].sizes.should.be.a('array')
        res.body.products[0].should.have.property('site')
        res.body.products[0].site.should.be.a('string')
        res.body.products[0].site.should.be.equal('dafiti')
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].images_urls.should.be.a('array')
        res.body.products[0].should.have.property('categories')
        res.body.products[0].categories.should.be.a('array')
        res.body.products[0].should.have.property('description')
        res.body.products[0].description.should.be.a('string')
        res.body.products[0].should.have.property('productName')
        res.body.products[0].productName.should.be.a('string')
        res.body.products[0].should.not.have.property('disabled')
        res.body.products[0].should.not.have.property('categoriesOrigin')
        res.body.products[0].should.have.property('trackingUrl')

        // check if every site is from dafiti
        for(let i = 0; i < res.body.products.length; i++) {
          res.body.products[i].site.should.be.equal('dafiti')
        }

        done()
      })
    })

    it('should return 200 and filter by genders', (done) => {
      chai.request(app)
      .get('/api/products?currentPage=1&offset=10&parentCategory=Roupas&genders=["feminino", "infantil"]')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('pagination')
        res.body.should.have.property('products')
        res.body.products.should.have.length(10)
        res.body.products[0].should.have.property('_id')
        res.body.products[0]._id.should.be.a('string')
        res.body.products[0].should.have.property('url')
        res.body.products[0].url.should.be.a('string')
        res.body.products[0].should.have.property('title')
        res.body.products[0].title.should.be.a('string')
        res.body.products[0].should.have.property('brand')
        res.body.products[0].brand && res.body.products[0].brand.should.be.a('string')
        res.body.products[0].should.have.property('price')
        res.body.products[0].price.should.be.a('number')
        res.body.products[0].should.have.property('sizes')
        res.body.products[0].sizes.should.be.a('array')
        res.body.products[0].should.have.property('site')
        res.body.products[0].site.should.be.a('string')
        res.body.products[0].should.have.property('gender')
        res.body.products[0].gender.should.be.a('string')
        res.body.products[0].gender.should.be.equal('feminino')
        res.body.products[0].should.have.property('images_urls')
        res.body.products[0].images_urls.should.be.a('array')
        res.body.products[0].should.have.property('categories')
        res.body.products[0].categories.should.be.a('array')
        res.body.products[0].should.have.property('description')
        res.body.products[0].description.should.be.a('string')
        res.body.products[0].should.have.property('productName')
        res.body.products[0].productName.should.be.a('string')
        res.body.products[0].should.not.have.property('disabled')
        res.body.products[0].should.not.have.property('categoriesOrigin')
        res.body.products[0].should.have.property('trackingUrl')

        // check if every site is from dafiti
        for(let i = 0; i < res.body.products.length; i++) {
          res.body.products[i].gender.should.be.equal('feminino')
        }

        done()
      })
    })
  })

  describe('GET /api/products/statistics/filters', () => {
    it('should return 500 if cant get a connection with mongodb', (done) => {
      // stub database connection
      sinon.stub(mongodb, 'getConnection')
      .callsFake((clName, cb) => {
        cb(new Error('Unable to get a connection'), null)
      })

      chai.request(app)
      .get('/api/products?currentPage=1&offset=20&parentCategory=Roupas')
      .end((err, res) => {
        res.should.have.status(500)
        mongodb.getConnection.restore()
        done()
      })
    })

    it('should return 200 and a list of filters', (done) => {
      chai.request(app)
      .get('/api/products/statistics/filters')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('filters')
        res.body.filters.should.have.length(4)
        res.body.filters[0].filter.should.be.equal('sites')
        res.body.filters[1].filter.should.be.equal('brands')
        res.body.filters[2].filter.should.be.equal('sizes')
        res.body.filters[3].filter.should.be.equal('price')
        done()
      })
    })


    it('should return 422 if a strange param is set', (done) => {
      chai.request(app)
      .get('/api/products/statistics/filters?currentPage=1&offset=10&parentCategory=Roupas&randomParam=random')
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 422 a non json array is set in sites', (done) => {
      chai.request(app)
      .get('/api/products/statistics/filters?sites=Something')
      .end((err, res) => {
        res.should.have.status(422)
        chai.request(app)
        .get('/api/products/statistics/filters?sites=[Something, Something2]')
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })
    })

    it('should return 422 a non json array is set in sizes', (done) => {
      chai.request(app)
      .get('/api/products/statistics/filters?sizes=Something')
      .end((err, res) => {
        res.should.have.status(422)
        chai.request(app)
        .get('/api/products/statistics/filters?sizes=[Something, Something2]')
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })
    })

    it('should return 422 a non json array is set in brands', (done) => {
      chai.request(app)
      .get('/api/products/statistics/filters?brands=Something')
      .end((err, res) => {
        res.should.have.status(422)
        chai.request(app)
        .get('/api/products/statistics/filters?brands=[Something, Something2]')
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })
    })

    it('should return 422 a non json array is set in genders', (done) => {
      chai.request(app)
      .get('/api/products/statistics/filters?genders=Something')
      .end((err, res) => {
        res.should.have.status(422)
        chai.request(app)
        .get('/api/products/statistics/filters?genders=[Something, Something2]')
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
      })
    })

    it('should return 422 if priceMin and Max is set', (done) => {
      chai.request(app)
      .get('/api/products/statistics/filters?priceMin=100&priceMax=10')
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })

    it('should return 200 if we define a filter that doesnt return any products', (done) => {
      chai.request(app)
      .get('/api/products/statistics/filters?brands=["Colcci"]')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('filters')
        res.body.filters.should.have.length(4)
        res.body.filters[0].filter.should.be.equal('sites')
        res.body.filters[1].filter.should.be.equal('brands')
        res.body.filters[2].filter.should.be.equal('sizes')
        res.body.filters[3].filter.should.be.equal('price')
        done()
      })
    })

    it('should return 200 and filter by brand', (done) => {
      chai.request(app)
      .get('/api/products/statistics/filters?brands=["colcci"]')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('filters')
        res.body.filters.should.have.length(4)
        res.body.filters[0].filter.should.be.equal('sites')
        res.body.filters[1].filter.should.be.equal('brands')
        res.body.filters[2].filter.should.be.equal('sizes')
        res.body.filters[3].filter.should.be.equal('price')
        done()
      })
    })

    it('should return 200 and filter by sizes', (done) => {
      chai.request(app)
      .get('/api/products/statistics/filters?sizes=["40", "42"]')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('filters')
        res.body.filters.should.have.length(4)
        res.body.filters[0].filter.should.be.equal('sites')
        res.body.filters[1].filter.should.be.equal('brands')
        res.body.filters[2].filter.should.be.equal('sizes')
        res.body.filters[3].filter.should.be.equal('price')
        done()
      })
    })

    it('should return 200 and filter by site', (done) => {
      chai.request(app)
      .get('/api/products/statistics/filters?currentPage=1&offset=10&parentCategory=Roupas&sites=["dafiti"]')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('filters')
        res.body.filters.should.have.length(4)
        res.body.filters[0].filter.should.be.equal('sites')
        res.body.filters[1].filter.should.be.equal('brands')
        res.body.filters[2].filter.should.be.equal('sizes')
        res.body.filters[3].filter.should.be.equal('price')
        done()
      })
    })

    it('should return 200 and filter by genders', (done) => {
      chai.request(app)
      .get('/api/products/statistics/filters?genders=["feminino", "infantil"]')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('filters')
        res.body.filters.should.have.length(4)
        res.body.filters[0].filter.should.be.equal('sites')
        res.body.filters[1].filter.should.be.equal('brands')
        res.body.filters[2].filter.should.be.equal('sizes')
        res.body.filters[3].filter.should.be.equal('price')
        done()
      })
    })
  })

  describe('GET /api/products/statistics/categories', () => {
    it.skip('should return 500 if cant get a connection with mongodb', (done) => {

      sinon.stub(Cloth, 'distinct')
      .callsFake(() => {
        return Promise.reject(new Error('Failed to connect to mongodb!'))
      })

      chai.request(app)
      .get('/api/products/statistics/categories')
      .end((err, res) => {
        res.should.have.status(500)
        Cloth.distinct.restore()
        done()
      })
    })

    it('should return 200 and a list of categories', (done) => {
      chai.request(app)
      .get('/api/products/statistics/categories')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('categories')
        res.body.categories.should.have.property('masculino')
        res.body.categories.masculino.should.have.property('Roupas')
        res.body.categories.masculino.should.have.property('Calçados')
        res.body.categories.masculino.should.have.property('Acessórios')
        res.body.categories.masculino.Roupas.should.be.a('array')
        res.body.categories.masculino.Calçados.should.be.a('array')
        res.body.categories.masculino.Acessórios.should.be.a('array')
        res.body.categories.should.have.property('feminino')
        res.body.categories.feminino.should.have.property('Roupas')
        res.body.categories.feminino.should.have.property('Calçados')
        res.body.categories.feminino.should.have.property('Acessórios')
        res.body.categories.feminino.Roupas.should.be.a('array')
        res.body.categories.feminino.Calçados.should.be.a('array')
        res.body.categories.feminino.Acessórios.should.be.a('array')
        res.body.categories.should.have.property('infantil')
        res.body.categories.infantil.should.have.property('Roupas')
        res.body.categories.infantil.should.have.property('Calçados')
        res.body.categories.infantil.should.have.property('Acessórios')
        res.body.categories.infantil.Roupas.should.be.a('array')
        res.body.categories.infantil.Calçados.should.be.a('array')
        res.body.categories.infantil.Acessórios.should.be.a('array')
        res.body.categories.should.have.property('unissex')
        res.body.categories.unissex.should.have.property('Roupas')
        res.body.categories.unissex.should.have.property('Calçados')
        res.body.categories.unissex.should.have.property('Acessórios')
        res.body.categories.unissex.Roupas.should.be.a('array')
        res.body.categories.unissex.Calçados.should.be.a('array')
        res.body.categories.unissex.Acessórios.should.be.a('array')
        done()
      })
    })

    it('should return 422 if a strange param is set', (done) => {
      chai.request(app)
      .get('/api/products/statistics/categories?parentCategory=Roupas&randomParam=random')
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
    })
  })

  describe('GET /api/products/:productId', () => {

    it('should return 500 if cant get a connection with mongodb', (done) => {
      // stub database connection
      sinon.stub(mongodb, 'getConnection')
      .callsFake((clName, cb) => {
        cb(new Error('Unable to get a connection'), null)
      })

      chai.request(app)
      .get('/api/products/599ef50a6122b9000c4a1def')
      .end((err, res) => {
        res.should.have.status(500)
        mongodb.getConnection.restore()
        done()
      })
    })

    it('should return 200 and a product object', (done) => {
      chai.request(app)
      .get(`/api/products/${products[0]._id.toString()}`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('_id')
        res.body._id.should.be.a('string')
        res.body.should.have.property('description')
        res.body.description.should.be.a('string')
        res.body.should.have.property('title')
        res.body.title.should.be.a('string')
        res.body.should.have.property('url')
        res.body.url.should.be.a('string')
        res.body.should.not.have.property('categoriesOrigin')
        res.body.should.not.have.property('disabled')
        res.body.should.have.property('images_urls')
        res.body.images_urls.should.be.a('array')
        res.body.should.have.property('productName')
        res.body.productName.should.be.a('string')
        res.body.should.have.property('categories')
        res.body.categories.should.be.a('array')
        res.body.should.have.property('sizes')
        done()
      })
    })

    it('should return 404 if product is not found', (done) => {
      chai.request(app)
      .get('/api/products/111111111111111111111111')
      .end((err, res) => {
        res.should.have.status(404)
        res.body.should.have.property('message')
        res.body.message.should.equal('Product not found.')
        done()
      })
    })

    it('should return 400 if product id is incorrect', (done) => {
      chai.request(app)
      .get('/api/products/123')
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.have.property('error')
        res.body.error.should.equal('Incorrect parameters.')
        done()
      })
    })

  })
})
