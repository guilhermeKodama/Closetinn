import config from '/config'
import request from 'request'
import ping from 'ping'
const rp = require('request-promise')

module.exports = {
  getHealthcheck: function(req, res, next) {
    request(config.mlAPI , function (error, response, body) {
      if(error || response.statusCode !== 200) {
        res.status(500).send({
          api: 'ok',
          mlApi: {
            error,
            statusCode: response && response.statusCode
          },
          env: process.env
        })
      } else {
        res.send({
          api: 'ok',
          mlApi: 'ok'
        })
      }
    })
  },

  ping: async (req, res, next) => {
    const { host, port=80, env } = req.query
    const hostEnv = process.env[env]
    try {
      const resp = await rp(`http://${hostEnv || host}:${port}`)
      res.send({ env: process.env, resp})
    } catch(e) {
      console.log('ERROR:', e)
      res.status(500).send({ error: e && e.message })
    }
  }
}
