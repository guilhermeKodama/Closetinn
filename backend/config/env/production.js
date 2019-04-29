module.exports = {
  tokenSecret: process.env.TOKEN_SECRET,
  passwordSecret: process.env.PASSWORD_SECRET,
  mlAPI: `http://${process.env.MLAPI_SERVICE_HOST}:${process.env.MLAPI_SERVICE_PORT}`,
  queueAPI: `http://${process.env.QUEUE_SERVICE_HOST}:${process.env.QUEUE_SERVICE_PORT}`,
  facebookAPI: process.env.FACEBOOK_GRAPH_HOST,
  facebookAppAccessToken: process.env.FACEBOOK_APP_ACCESS_TOKEN,
  prefix: process.env.PREFIX,
  elasticSearch: {
    host: `${process.env.ELASTICSEARCH_SERVICE_HOST}:${process.env.ELASTICSEARCH_SERVICE_PORT}`
  },
  mongodb: {
    url: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    clothesCollection: process.env.CLOTHES_COLLECTION,
    usersCollection: process.env.USERS_COLLECTION
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_USER,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
}
