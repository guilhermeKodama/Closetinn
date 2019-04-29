const env = process.env.NODE_ENV || 'local'
const config = require(`./env/${env}`)

module.exports = Object.assign({}, config)
