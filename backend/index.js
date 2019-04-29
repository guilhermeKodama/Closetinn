require('dotenv').config()
require('babel-register')

if (process.env.NODE_ENV === 'script') {
  require(`./scripts/${process.argv[2]}.js`)
} else {
  require('./bin/www')
}
