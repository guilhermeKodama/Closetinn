import jwt from 'jsonwebtoken'
import request from 'request'
import security from '../../utils/security'
import email from '../../utils/email'
import cuid from 'cuid'
import config from '/config'
import User from '/src/models/user'
import Cart from '/src/models/cart'

module.exports = {
  /**
    * @api {post} /auth Authenticate user
    * @apiVersion 1.0.0
    * @apiName AuthenticateUser
    * @apiGroup Auth
    * @apiPermission none
    *
    * @apiDescription Authenticate user by closetinn accout
    *
    * @apiExample Example usage:
    *    curl -X POST -H "Content-Type: application/json" -d '{
    *      "email": "test1@gmail.com",
    *      "password": "password1"
    *    }' "http://localhost:3000/user/auth"
    *
    * @apiUse HeaderV1Unsecure
    *
    * @apiUse UserSucccess
    *
    * @apiErrorExample AuthenticationFailed (example):
    *    HTTP/1.1 401 Unauthorized
    *    {
    *      "error": "Authentication Failed"
    *    }
    *
    * @apiErrorExample {json} UserNotFound (example):
    *     HTTP/1.1 404 Not Found
    *     {
    *       "message": "User not found."
    *     }
    *
    * @apiErrorExample {json} BadRequest (example):
    *     HTTP/1.1 400 Bad Request
    *     {
    *       "message": "Bad Request."
    *     }
    *
    * @apiErrorExample {json} UnprocessableEntity (example):
    *     HTTP/1.1 422 Unprocessable Entity
    *     {
    *       "error": {
    *         "message": "Invalid format or missing required property"
    *       }
    *     }
    *
    * @apiUse TokenError
    */
  authenticateUser: async (req, res, next) => {
    try {
      const { email, password, anonymousId } = req.body
      const user = await User.findByCredentials(req.body.email, req.body.password)
      const token = await user.generateAuthToken()

      // merge cart if anonymous has cart
      const cart = await Cart.mergeAnonymousCart(anonymousId, user._id.toString())
      await cart.fetchProducts()

      return res.send({
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        closet: user.closet,
        cart
      })
    } catch(error) {
      console.log('ERROR:', error)
      if (error.name === 'UserNotFound') {
        return res.status(404).send({ message: error.message })
      } else if (error.name === 'AuthFailedFacebookUser') {
        return res.status(401).send({ message: error.nessage })
      } else if (error.name === 'WrongPassword') {
        return res.status(401).send({ message: error.message })
      } else {
        return res.status(400).send(error)
      }
    }
  },

  /**
    * @api {post} /auth/unknown Authenticate unknow user (no login)
    * @apiVersion 1.0.0
    * @apiName AuthenticateUnknownUser
    * @apiGroup Auth
    * @apiPermission none
    *
    * @apiDescription Authenticate unknow user (not logged yet)
    */
  authenticateUnknownUser: function(req, res, next) {
    const token = security.generateToken(cuid())
    res.send({ token })
  },

  /**
  @api {post} /auth/facebook Validates user facebook login
  @apiVersion 0.0.1
  @apiName ValidateFacebook
  @apiGroup Auth
  @apiDescription
  Authenticate facebook user

  @apiExample Example usage:
  curl -X POST \
    http://local.closetinn.com.br:3001/auth/facebook \
    -H 'content-type: application/json' \
    -d '{
  	"email": "guilherme.kodama@gmail.com",
  	"userID": "1611038962290468",
  	"accessToken": "EAAWIbtRfa7kBAFUSG44NwJUvOYkkfrQhmXli5hVulUDzkd7KeZCNGk7yfnJkdubEjbkHlt0d5xxsZBvE6dV2YToj32ZAHEccvZBgNaUDGN1aEZBqHaAnlZC4ZAsGcXspomsOlSLCvZAEI0DajtDurBYiGTYHr2Df9ZComIf8sHLm10QZDZD"
  }'

  @apiUse HeaderV1Unsecure

  @apiSuccess {String} token  Token

  @apiSuccessExample {json} Success-Response:
  HTTP/1.1 200 OK
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdHRyaWJ1dGVzIjp7ImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWQiOiJjaXl1ZWJvc3gwMDAwajNnMDRhN2ltajU4IiwibmFtZSI6IkZ1bGFubyBTaWNyYW5vIGRhIFNpbHZhIiwicGFzc3dvcmQiOiI3YjNkYWE5YmVlZjQ1ZGM3ZWEyMWY5YzQ2NDViODgwY2JhMDE5NDdjNzY4YmM4MDk5Mjc2OTRmMjM5NDA0OTFjMzFiODQ2ZmMzMWYxNzE2NTI3YzZjNDkwNTAzOTA5MTAzNTIwOTg5OTc1Y2NmNjFhY2VmN2MwMGNjNzA3NWQ2MiIsInNhbHQiOiIxOTkzOTY4OTgyMDJjZjc2IiwiY3JlYXRlZF9hdCI6IjIwMTctMDItMDZUMTc6NTM6MTguNDIyWiIsInVwZGF0ZWRfYXQiOm51bGx9LCJfcHJldmlvdXNBdHRyaWJ1dGVzIjp7ImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWQiOiJjaXl1ZWJvc3gwMDAwajNnMDRhN2ltajU4IiwibmFtZSI6IkZ1bGFubyBTaWNyYW5vIGRhIFNpbHZhIiwicGFzc3dvcmQiOiI3YjNkYWE5YmVlZjQ1ZGM3ZWEyMWY5YzQ2NDViODgwY2JhMDE5NDdjNzY4YmM4MDk5Mjc2OTRmMjM5NDA0OTFjMzFiODQ2ZmMzMWYxNzE2NTI3YzZjNDkwNTAzOTA5MTAzNTIwOTg5OTc1Y2NmNjFhY2VmN2MwMGNjNzA3NWQ2MiIsInNhbHQiOiIxOTkzOTY4OTgyMDJjZjc2IiwiY3JlYXRlZF9hdCI6IjIwMTctMDItMDZUMTc6NTM6MTguNDIyWiIsInVwZGF0ZWRfYXQiOm51bGx9LCJjaGFuZ2VkIjp7fSwicmVsYXRpb25zIjp7fSwiY2lkIjoiYzIiLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjoxLCJfa25leCI6bnVsbCwiaWQiOiJjaXl1ZWJvc3gwMDAwajNnMDRhN2ltajU4IiwiaWF0IjoxNDg2NDA1Nzc0LCJleHAiOjE0ODY0OTIxNzR9.KcrYiCiiPHsP742c6xjcTwVQ7UE5k5csVhTc9mCAJYc"
  }

  @apiErrorExample {String} 422 Unprocessable Entity:
  HTTP/1.1 422 Unprocessable Entity
  Bad Request
  @apiUse TokenError
  */
  authenticateAndSaveFacebookUser: function(req, res, next) {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      facebookUserID: req.body.userID,
      facebookPicture: req.body.picture,
      facebookAccessToken: req.body.accessToken,
      facebookSignedRequest: req.body.signedRequest
    }

    // validate facebook token
    request(`${config.facebookAPI}/debug_token?input_token=${req.body.accessToken}&access_token=${config.facebookAppAccessToken}`, (error, response, body) => {
      const responseJSON = JSON.parse(response.body)

      if (error || response.statusCode === 400 || responseJSON.data.error) {
        return res.status(400).send({ message: responseJSON.data.error })
      } else {
        User.findOneAndUpdate({
          email: newUser.email
        }, {
          $set: newUser
        }, {
          new: true,
          projection: {
            password: 0,
            salt: 0,
            __v: 0
          }
        }).then((user) => {
          if (!user) {
            const fbUser = new User(newUser)

            // user dont exist, save it
            fbUser.save().then(() => {
              return fbUser.generateAuthToken()
            }).then((token) => {
              res.send({
                token,
                _id: fbUser._id,
                email: fbUser.email,
                role: fbUser.role,
                name: fbUser.name,
                facebookPicture: fbUser.facebookPicture,
                closet: fbUser.closet
              })
            }, error => {
              if (error.code === 11000) {
                res.status(409).send({ message: 'User already exist' })
              } else {
                res.status(400).send(error)
              }
            })
          } else {
            return user.generateAuthToken().then((token) => {
              res.send({
                token,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                facebookPicture: user.facebookPicture,
                closet: user.closet
              })
            })
          }
        }, error => {
          res.status(400).send(error)
        })
      }
    })
  },

  /**
    * @api {post} /auth/forgot Validates user email and send email to change the password
    * @apiVersion 1.0.0
    * @apiName ForgotPassword
    * @apiGroup Auth
    * @apiDescription
    */
  sendForgotPasswordEmail: function(req, res, next) {
    // Check if user exist
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) return res.status(404).send({ message: 'User not found.' })

      const token = security.generateForgotPasswordToken({ email: user.email })

      //send email
      const mailOptions = {
        to: user.email,
        from: 'closetinn@support.com',
        subject: 'Closetinn esqueceu a senha',
        text: 'Por favor click no link abaixo para continuar o processo:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n'
      }

      email.sendEmail(mailOptions, (emailError, info) => {
        if (emailError) {
          res.status(502).send({ error: emailError })
        } else {
          res.send()
        }
      })
    }, error => {
      return res.status(400).send(error)
    })
  },

  /**
    * @api {post} /auth/forgot/validate Validates token used to allow change users password
    * @apiVersion 0.0.1
    * @apiName ForgotPassword
    * @apiGroup Auth
    * @apiDescription
    */
  checkIfForgotPasswordTokenIsValid: function(req, res, next) {
    const token = req.body.token

    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        if(err.name === 'TokenExpiredError') {
          return res.status(401).send({ message: 'Token has expired!' })
        } else {
          return res.status(401).send({ message: 'Token is not valid!' })
        }
      } else {
        // Check if user exist
        if (decoded.email) {
          User.findOne({ email: decoded.email }).then((user) => {
            if (!user) return res.status(404).send({ message: 'User not found.' })

            return res.send()
          }, error => {
            return res.status(400).send(error)
          })
        } else {
          return res.status(401).send({ message: 'Token wrongly decoded' })
        }
      }
    })
  },

  /**
    * @api {post} /auth/admin/validate Validates token used by admins
    * @apiVersion 0.0.1
    * @apiName AdminTokenValidate
    * @apiGroup Auth
    * @apiDescription
    */
  checkIfAdminTokenIsValid: function (req, res, next) {
    const token = req.body.token

    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        if(err.name === 'TokenExpiredError') {
          return res.status(401).send({ message: 'Token has expired!' })
        } else {
          return res.status(401).send({ message: 'Token is not valid!' })
        }
      } else {
        // Check if user exist
        if (decoded.email) {
          User.findOne({ email: decoded.email }).then((user) => {
            if (!user) return res.status(404).send({ message: 'User not found.' })

            if(user.role !== 'admin') return res.status(403).send({ message: 'User dont have admin permissions' })

            return res.send()
          }, error => {
            return res.status(400).send(error)
          })
        } else {
          return res.status(401).send({ message: 'Token wrongly decoded' })
        }
      }
    })
  },

  authenticateEmailUser: async (req, res, next) => {
    try {
      const { emails } = req.body
      const users = await User.find({ email: { '$in': emails } })
      const tokens = {}
      for(let i = 0; i < users.length; i++) {
        const user = users[i]
        const token = await user.generateAuthToken()
        tokens[user.email] =token
      }

      return res.json({ tokens })
    } catch(error) {
      console.log('ERROR:', error)
      if (error.name === 'UserNotFound') {
        return res.status(404).send({ message: error.message })
      } else if (error.name === 'AuthFailedFacebookUser') {
        return res.status(401).send({ message: error.nessage })
      } else if (error.name === 'WrongPassword') {
        return res.status(401).send({ message: error.message })
      } else {
        return res.status(400).send(error)
      }
    }
  }
}
