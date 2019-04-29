const env = process.env.NODE_ENV || 'local'
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const config = require('./config')
const winston = require('winston')
const expressWinston = require('express-winston')
var boolParser = require('express-query-boolean')
const mongoose = require('./src/db/mongoose')
import elasticsearch from './src/db/elasticsearch'

var app = express()

/* ENABLE CORS */
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  next()
})

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//don't show the log when it is test
if(env !== 'test') {
  app.use(logger('dev'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(boolParser())

// versioning
app.use(function(req, res, next) {
  //req.version is used to determine the version
  if(req.headers['accept-version'])
    req.headers['accept-version'] = '*'

  req.version = req.headers['accept-version']
  next()
})

// Load modules
const modules = require('./src/modules')
modules(app)

/* GET home page. */
/**
 * Express only serves static assets in production
 */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')))
}

app.use(express.static(path.join(__dirname, 'static/')))

app.get(/^((?!\/api\/).)*$/, function(req, res, next) {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'))
})

// invalid data
app.use(function(err, req, res, next) {
  var responseData
  if (err.name === 'JsonSchemaValidation') {
      // Log the error however you please
      // console.log(err.message)
      // logs "express-jsonschema: Invalid data found"
      // Set a bad request http response status
      res.status(422)
      // Format the response body
      responseData = {
         message: 'Unprocessable Entity',
         jsonSchemaValidation: true,
         validations: err.validations  // All of your validation information
      }
      // Respond with the right content type
      res.json(responseData)
  } else {
      // pass error to next error middleware handler
      next(err)
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// ERROR HANDLERS
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  winston.error(err)
  res.status(err.status || 500)
  res.send()
})

module.exports = { app }
