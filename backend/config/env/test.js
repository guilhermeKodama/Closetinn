module.exports = {
  tokenSecret: '018c67801bbc6f65b3ef0ecd99e7c0e8',
  passwordSecret: 'c0a6137c0a9b8d24da27cf972e8ddc14',
  mlAPI: 'http://localhost:8000',
  queueAPI: 'http://localhost:3000',
  facebookAPI: 'https://graph.facebook.com',
  facebookAppAccessToken: '1557384474356665|jJXKWOeYqEPpSYKrP8o9hqT9p-o',
  prefix: '/api',
  elasticSearch: {
    host: 'localhost:9200'
  },
  mongodb: {
    url: 'mongodb://127.0.0.1:27017/fashionbot-test',
    database: 'fashionbot-test',
    clothesCollection: 'clothes',
    usersCollection: 'users'
  },
  cloudinary: {
    cloudName: 'closetinn',
    apiKey: '494558945392248',
    apiSecret: 'RXGDWht3A8SbwJhIyb9nO7jETXU',
  },
}
