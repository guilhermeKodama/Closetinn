import chai from 'chai'
import sinon from 'sinon'
import { app } from '/app'
import config from '/config'
import chaiHttp from 'chai-http'
import User from '/src/models/user'
import Newsletter from '/src/models/newsletter'
import { user } from '/seeds/users'
import { newsletters } from '/seeds/newsletters'
const should = chai.should()
chai.use(chaiHttp)

describe('Newsletters', () => {

  beforeEach((done) => {
    User.create(user).then(() => {
      done()
    })
  })

  afterEach((done) => {
    Newsletter.remove({}).then(() => {
      User.remove({}).then(() => {
        done()
      })
    })
  })

  describe('POST /api/newsletters', () => {

    it('should return 200 and create a new subscription', (done) => {
      chai.request(app)
      .post('/api/newsletters')
      .send({ email: 'whouser@gmail.com' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('_id')
        res.body.should.have.property('email')
        res.body.should.not.have.property('user')
        done()
      })
    })

    it('should return 200 and create a new subscription', (done) => {
      chai.request(app)
      .post('/api/newsletters')
      .send({ email: user.email })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('_id')
        res.body.should.have.property('email')
        res.body.should.have.property('user')
        done()
      })
    })
  })

  describe('DELETE /api/newsletters/:id', () => {
    before((done) => {
      Newsletter.create(newsletters[0]).then(() => {
        done()
      })
    })
    it('should delete the subscription', (done) => {
      chai.request(app)
      .delete(`/api/newsletters/${newsletters[0]._id}`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('success')
        done()
      })
    })
    it('should return 404 if id doesnt exist', (done) => {
      chai.request(app)
      .delete('/api/newsletters/5aae9d3523dcda026155e732')
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
    })
  })
})
