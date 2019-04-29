const crypto = require('crypto')
const jwt = require('jsonwebtoken')
import config from '/config'

module.exports = {
  /**
   * generates random string of characters i.e salt
   * @function
   * @param {number} length - Length of the random string.
   */
  generateSalt: function(length) {
      return crypto.randomBytes(Math.ceil(length/2))
              .toString('hex') /** convert to hexadecimal format */
              .slice(0,length)   /** return required number of characters */
  },
  /**
   * hash password with sha512.
   * @function
   * @param {string} password - List of required fields.
   * @param {string} salt - Data to be validated.
   */
  sha512: function(password, salt) {
      const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
      hash.update(password);
      const value = hash.digest('hex');
      return {
          salt: salt,
          passwordHash: value
      }
  },
  encrypt: function (password) {
    const salt = this.generateSalt(16) /** Gives us salt of length 16 */
    const data = this.sha512(password, salt)
    return {
      password,
      passwordHashed: data.passwordHash,
      salt: data.salt
    }
  },
  validate: function(password, storedPassword, salt) {
    const data = this.sha512(password, salt)
    return data.passwordHash === storedPassword
  },
  generateToken: function(payload) {
    // Payload could be an object literal, buffer or string. Please note that exp is only set if the payload is an object literal.
    if (payload === Object(payload)) {
      return jwt.sign(payload, config.tokenSecret)
    } else {
      return jwt.sign(payload, config.tokenSecret)
    }
  },
  generateForgotPasswordToken: function(payload) {
    return jwt.sign(payload, config.tokenSecret, { expiresIn: '1h' }) // expires in 24 hours
  }

}
