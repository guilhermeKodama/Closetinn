import config from '/config'
import { ObjectID } from 'mongodb'
import mongodb from '/src/utils/mongodb'
import request from 'request'
import Cloth from '/src/models/cloth'

module.exports = {

  search: async (req, res, next) => {
    let { query, offset, currentPage } = req.query
    offset = (offset && parseInt(offset)) || 20
    currentPage = (currentPage && parseInt(currentPage)) || 1

    const where = {
        $text : {
          $search : req.query.query,
          $caseSensitive: false
        }
      }

    const results = await Cloth.find(where)
      .skip(currentPage === 1? 0 : (currentPage - 1) * offset)
      .limit(offset)
      .exec()

    const count = await Cloth.count(where)
    const pages = count % offset > 0? parseInt(count / offset) + 1 : parseInt(count / offset)

    // pagination
    const pagination = {
      currentPage,
      offset,
      totalPages: parseInt(count / offset) < 1? 1 : pages,
      totalItems: count
    }

    res.json({ pagination, products: results })
  },

  mlapiSearch: async (req, res, next) => {
    const query = req.query.query.replace(/\s/g,'%20')

    request(config.mlAPI + '/search?query=' + query, function (error, response, body) {
      if(error || response.statusCode === 500) {
        return res.status(500).json({ error })
      } else {
        let ids = []

        try {
          const similarests = JSON.parse(body).products
          ids = similarests.map((similarest) => ObjectID(similarest['id']))
        } catch (err) {
          return res.status(400).json({ error: 'Incorrect parameters.' })
        }

        mongodb.getConnection(config.mongodb.clothesCollection, (errConn, cl) => {
          if (errConn) {
            res.status(500).json({ error: errConn })
          } else {
            cl.find({ _id: { $in: ids }},
              {
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
                'gender': 1
              })
            .toArray((err, products) => {
              if (err) {
                return res.status(500).json({ error: err })
              } else {
                return res.send({ products })
              }
            })
          }
        })
      }
    })
  },

  elasticSearch: async (req, res, next) => {
    try {
      let { query, offset, currentPage } = req.query
      offset = (offset && parseInt(offset)) || 20
      currentPage = (currentPage && parseInt(currentPage)) || 1

      const results = await Cloth.search({
        query_string: {
          query
        }
      },
      {
        from: currentPage === 1? 0 : (currentPage - 1) * offset,
        size: offset,
        hydrate: true
      })

      const count = results.hits.total
      const pages = count % offset > 0? parseInt(count / offset) + 1 : parseInt(count / offset)

      // pagination
      const pagination = {
        currentPage,
        offset,
        totalPages: parseInt(count / offset) < 1? 1 : pages,
        totalItems: count
      }

      res.json({ pagination, products: results.hits.hits })
    } catch(error) {
      console.log('ERROR:', error)
      res.status(500).json({ error: error && error.message })
    }
  }

  /* config to understand semi terms
    const results = await Cloth.search(
      {
        multi_match: {
          query,
          fields: ['productName'],
          type: 'phrase_prefix',
          auto_generate_synonyms_phrase_query: true
        }
      },
      {
        hydrate: true
      }
    )
   */
}
