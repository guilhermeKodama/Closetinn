import utils from './utils'
import config from '/config'
import { concat } from 'async'
import { ObjectID } from 'mongodb'
import { mockedCategories } from './mock.js'
import Cloth from '/src/models/cloth'
import mongodb from '/src/utils/mongodb'

const productAttrs = {
  '_id': 1,
  'title': 1,
  'productName': 1,
  'description': 1,
  'categories': 1,
  'images_urls': 1,
  'url': 1,
  'brand': 1,
  'price': 1,
  'sizes': 1,
  'image_medium_url': 1,
  'site': 1,
  'gender': 1,
  'trackingUrl': 1,
  'priceOld': 1,
  'priceDiscount': 1
}

module.exports = {
  /**
  @api {get} /products Get paginated and filtered products
  @apiVersion 0.0.1
  @apiName GetProducts
  @apiGroup Products
  @apiDescription
  Get products with pagination and filters

  @apiParam {Array} [sizes]  Array containing available sizes.
  @apiParam {Array} [brands] Brands filter.
  @apiParam {Array} [genders] Genders filter.
  @apiParam {String} [mainCategory] Main category (required).
  @apiParam {Number} [offset] size of page.
  @apiParam {Number} [priceMin] initial price range.
  @apiParam {Number} [priceMax] final price range.
  @apiParam {Number} [currentPage] current page (required).
  @apiParam {Array} [sites] sites array.

  @apiSuccessExample {json} Success-Response:
  HTTP/1.1 200 OK
  {
    "pagination": {
        "currentPage": 1,
        "offset": 10,
        "totalPages": 94,
        "totalItems": 934
    },
    "products": [
        {
            "_id": "5a149bbcf32c593d17eec8f7",
            "description": "Bermuda Sarja Refined Bl-6991, feita em 98% algodão e 2% elastano. Possui lavagem color. Cintura média e cós com passantes para cinto. Conta com bolsos frontais com bolso menor e bolsos traseiros. Fecho em zíper e botão. Barra dobrada. Peso: 352g. Informação AdicionalComprimento Aproximado (Tamanho 44): 54cm.Pode haver variação de 2cm no comprimento de cada tamanho. Medidas do ModeloO modelo da foto detalhe usa tamanho 44 e possui as seguintes medidas: Altura 1,88m | Tórax 106cm | Cintura 87cm | Quadril 104cm | Peso: 90kg.",
            "title": "Bermuda Sarja Masculina Refined - Azul",
            "url": "http://www.passarela.com.br/produto/bermuda-sarja-masculina-refined-azul-6810037002-0",
            "gender": "masculino",
            "brand": null,
            "sizes": [
                "38",
                "40",
                "42",
                "44",
                "46",
                "48"
            ],
            "image_medium_url": "http://imagens.passarela.com.br/passarelaEstatico/imagens/produto/6810037002/6810037002_1_G.JPG",
            "images_urls": [
                "http://imagens.passarela.com.br/passarelaEstatico/imagens/produto/6810037002/6810037002_1_Z.JPG",
                "http://imagens.passarela.com.br/passarelaEstatico/imagens/produto/6810037002/6810037002_2_Z.JPG",
                "http://imagens.passarela.com.br/passarelaEstatico/imagens/produto/6810037002/6810037002_3_Z.JPG",
                "http://imagens.passarela.com.br/passarelaEstatico/imagens/produto/6810037002/6810037002_4_Z.JPG",
                "http://imagens.passarela.com.br/passarelaEstatico/imagens/produto/6810037002/6810037002_5_Z.JPG"
            ],
            "productName": "Bermuda Sarja Masculina Refined - Azul",
            "site": "passarela",
            "price": 79.99,
            "categories": [
                "Masculino",
                "Roupas"
            ]
        },
        {
            "_id": "5a149bc5f32c593c781de6bb",
            "description": "Short 'Grafitti' estampado branco, Le Lis Blanc. Possui cintura média, passantes no cós, cinco bolsos, estampa, detalhes puídos, barra desfiada e fechamento por botão e zíper.",
            "title": "Le Lis Blanc",
            "url": "https://www.farfetch.com/br/shopping/women/le-lis-blanc-short-grafitti-estampado-item-12507548.aspx?storeid=9688&from=1",
            "gender": "feminino",
            "brand": "le lis blanc",
            "sizes": [
                "36",
                "38",
                "40",
                "42",
                "44"
            ],
            "image_medium_url": "https://cdn-images.farfetch-contents.com/12/50/75/48/12507548_11793696_322.jpg",
            "images_urls": [
                "https://cdn-images.farfetch-contents.com/12/50/75/48/12507548_11793696_1000.jpg",
                "https://cdn-images.farfetch-contents.com/12/50/75/48/12507548_11793697_1000.jpg",
                "https://cdn-images.farfetch-contents.com/12/50/75/48/12507548_11793698_1000.jpg",
                "https://cdn-images.farfetch-contents.com/12/50/75/48/12507548_11793699_1000.jpg",
                "https://cdn-images.farfetch-contents.com/12/50/75/48/12507548_11793700_1000.jpg"
            ],
            "productName": "Short 'Grafitti' estampado",
            "site": "farfetch",
            "price": 359.9,
            "categories": [
                "Feminino",
                "Roupas"
            ]
        }
      ]
    }

  @apiErrorExample {String} 404 Not Found:
  HTTP/1.1 404 Not found
  Not Found
  */

  getProducts: function(req, res, next) {
    mongodb.getConnection(config.mongodb.clothesCollection, (errConn, cl) => {
      if(errConn) {
        res.status(500).json({ error: errConn })
      } else {
        const offset = parseInt(req.query.offset)
        const currentPage = parseInt(req.query.currentPage)
        let options = {}

        try {
          options = utils.transformQueryInMongoFilters(req.query)
        } catch(error) {
          return res.status(422).json({ error: error.message })
        }

        cl.find(options, productAttrs)
        .sort( { _id: 1 } )
        .skip(currentPage === 1? 0 : (currentPage - 1) * offset)
        .limit(offset)
        .toArray((err, products) => {
          if(err) {
            return res.status(500).json({ error: err })
          } else {
            cl.count(options, (countError, count) => {
              const pages = count % offset > 0? parseInt(count / offset) + 1 : parseInt(count / offset)

              const pagination = {
                currentPage,
                offset,
                totalPages: parseInt(count / offset) < 1? 1 : pages,
                totalItems: count
              }

              res.send({ pagination, products })
            })
          }
        })
      }
    })
  },

  /**
  @api {get} /products/:productId Get product by id
  @apiVersion 0.0.1
  @apiName GetProductById
  @apiGroup Products
  @apiDescription
  Return information about the product with that ID

  @apiSuccess {String} _id                    Product id
  @apiSuccess {String} title                  Product title
  @apiSuccess {String} productName            Product name
  @apiSuccess {String} description            Product description
  @apiSuccess {Array} categories              Product categories
  @apiSuccess {Array} images_urls              Product images urls
  @apiSuccess {String} url                    Product url

  @apiSuccessExample {json} Success-Response:
  HTTP/1.1 200 OK
  {
    "_id": "59a1a378f32c596305f43a26",
    "description": "Tênis Nike SB Check Solar Canvas Branco",
    "title": "Nike SB",
    "url": "https://www.kanui.com.br/Tenis-Nike-SB-Check-Solar-Canvas-Branco-3147069.html",
    "images_urls": [
        "https://dafitistatic-a.akamaihd.net/p/Nike-SB-Tênis-Nike-SB-Check-Solar-Canvas-Branco-8912-9607413-1-zoom.jpg",
        "https://dafitistatic-a.akamaihd.net/p/Nike-SB-Tênis-Nike-SB-Check-Solar-Canvas-Branco-8916-9607413-2-zoom.jpg",
        "https://dafitistatic-a.akamaihd.net/p/Nike-SB-Tênis-Nike-SB-Check-Solar-Canvas-Branco-8917-9607413-3-zoom.jpg",
        "https://dafitistatic-a.akamaihd.net/p/Nike-SB-Tênis-Nike-SB-Check-Solar-Canvas-Branco-8943-9607413-4-zoom.jpg"
    ],
    "productName": "Tênis Nike SB Check Solar Canvas Branco",
    "categories": [
        "Feminino",
        "Calçados"
    ]
  }

  @apiErrorExample {String} 404 Not Found:
  HTTP/1.1 404 Not found
  Not Found
  */
  getProduct: function(req, res, next) {
    let { productId } = req.params
    mongodb.getConnection(config.mongodb.clothesCollection, (errConn, cl) => {
      if(errConn) {
        res.status(500).json({ error: errConn })
      } else {

        try {
          productId = new ObjectID(productId)
        } catch (err) {
          return res.status(400).json({ error: 'Incorrect parameters.' })
        }

        cl.findOne({ _id: new ObjectID(productId) }, productAttrs, (error, product) => {
          if(error) {
            res.status(500).json({ error: error })
          } else {
            if (!product) {
              res.status(404).json({ message: 'Product not found.' })
            } else if (product) {
              res.send(product)
            }
          }
        })
      }
    })
  },
  /**
  @api {get} /products/filters Get available filters for products in our database
  @apiVersion 0.0.1
  @apiName GetProductsFilters
  @apiGroup Products
  @apiDescription
  Get available filters for products in our database
  **/
  getProductsFilters: function(req, res, next) {
    mongodb.getConnection(config.mongodb.clothesCollection, (errConn, cl) => {
      if(errConn) return res.status(500).json({ error: errConn })
      let options = {}

      try {
        options = utils.transformQueryInMongoFilters(req.query)
      } catch(error) {
        return res.status(422).json({ error: error.message })
      }

      const translation = {
        site: 'Sites',
        gender: 'Gêneros',
        brand: 'Marcas',
        sizes: 'Tamanho',
        price: 'Preços'
      }

      concat(
        ['site', 'brand', 'sizes'],
        (item, cb) => {
          cl.distinct(item, options, (errDistinct, values) => {
            const data = {
              filter: item === 'sizes'? 'sizes' : `${item}s`,
              name: translation[item],
              options: values.sort(),
              type: 'checkbox'
            }

            cb(errDistinct, data)
          })
        },
        (err, values) => {
          if(err) return res.status(500).json({ error: err })

          const filters = values.sort()

          cl.find(options)
          .sort({price:-1})
          .limit(1)
          .toArray((errPriceMax, results) => {
            if(results.length === 0) {
              filters.push({
                name: translation['price'],
                filter: 'price',
                type: 'range',
                min: 0,
                max: 1
              })
              return res.json({ filters })
            }

            if(errPriceMax) return res.status(500).json({ error: errPriceMax })

            const priceMax = results[0].price

            cl.find(options)
            .sort({price:+1})
            .limit(1)
            .toArray((errPriceMax, results) => {
              if(errPriceMax) return res.status(500).json({ error: errPriceMax })

              const priceMin = results[0].price

              filters.push({
                name: translation['price'],
                filter: 'price',
                type: 'range',
                min: priceMin,
                max: priceMax
              })

              return res.json({ filters })
            })
          })
      })
    })
  },

  /**
  @api {get} /products/categories Get available categories levels
  @apiVersion 0.0.1
  @apiName GetProductsCategories
  @apiGroup Products
  @apiDescription
  Get available categories in different levels
  **/
  getProductsCategories: async (req, res, next) => {
    // Let's keep that until we fix the performance issue in this endpoint
    // return res.json(mockedCategories)

    let categories = {}
    const genders = ['masculino', 'infantil', 'feminino', 'unissex']
    const mainSubCategories = ['roupas', 'calcados', 'acessorios']

    try {

      // lets get third level of our categories
      for(let i = 0; i < genders.length; i++) {
        const gender = genders[i]
        for(let j = 0; j < mainSubCategories.length; j++) {
          const msc = mainSubCategories[j]
          const result = await Cloth.distinct('categories.2', { gender, 'categories.1': msc, site: 'dafiti', origin: 'zanox' })
          if(!(gender in categories)) categories[gender] = {}
          categories[gender][msc] = result.sort()
        }
      }

      return res.json({ categories })
    } catch(error) {
      return res.status(500).json({ error: error && error.toString() })
    }
  }
}
