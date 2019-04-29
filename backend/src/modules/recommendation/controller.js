import config from '/config'
import { ObjectID } from 'mongodb'
import mongodb from '/src/utils/mongodb'
import request from 'request'
import recommendations from '/src/utils/recommendations'

module.exports = {

  getRecommendationBasedOnDescription: function(req, res, next) {
    request(config.mlAPI + '/recommendation/text/' + req.params.productId, function (error, response, body) {
      if(error || response.statusCode === 500) {
        return res.status(500).json({ error })
      } else {
        let ids = []

        try {
          const similarests = JSON.parse(body).products
          ids = similarests.map((similarest) => ObjectID(similarest['id']))
        } catch (err) {
          console.log('ERROR:', err)
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
                'priceDiscount': 1,
                'priceOld': 1,
                'trackingUrl': 1,
                'sizes': 1,
                'image_medium_url': 1,
                'site': 1,
                'gender': 1
              })
            .toArray((err, products) => {
              if (err) {
                return res.status(500).json({ error: err })
              } else {
                res.send({ products })
              }
            })
          }
        })
      }
    })
  }
}
