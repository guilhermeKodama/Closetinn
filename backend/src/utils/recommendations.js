import config from '/config'
import request from 'request'
import mongodb from '/src/utils/mongodb'



module.exports = {
  getRecommendationBasedOnDescription: (productId, cb) => {
    request(`${config.mlAPI}/recommendation/text/${productId}`, function (error, response, body) {
      cb(error, response)
    })
  },
  getRecommendationBasedOnDescriptionMock: (productId, cb) => {
    mongodb.getConnection(config.mongodb.clothesCollection, (errConn, cl) => {
      if(errConn) return cb(errConn, null)

      cl.find({ disabled: false },
        { '_id': 1, 'title': 1, 'productName': 1, 'description': 1, 'categories': 1, 'image_urls': 1, 'image_medium_url': 1, 'url': 1 })
      .sort( { _id: 1 } )
      .limit(10)
      .toArray((err, products) => {
        cb(err, { products })
      })
    })
  }
}
