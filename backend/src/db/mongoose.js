import mongoose from 'mongoose'
import config from '../../config'

// mongoose.set('debug', true)
mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
mongoose.connection.once('open', () => console.log('Mongoose: Connection open!'))
mongoose.Promise = global.Promise
mongoose.connect(config.mongodb.url, { poolSize: 10, keepAlive: true })

module.exports = mongoose
