const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../app').app

chai.use(chaiHttp)

module.exports = {
  getToken: (callback) => {
    chai.request(server)
    .post('/auth')
    .send({
      email: 'userTest@gmail.com',
      password: 'passwordTest'
    })
    .end((err, res) => {
      callback(res.body.token)
    })
  }
}
