const env = process.env.NODE_ENV || 'local'
const config = require(`./env/${env}`)

export default config
