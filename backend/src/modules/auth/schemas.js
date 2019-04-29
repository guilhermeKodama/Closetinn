module.exports = {
  authenticateUser: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
      anonymousId: { type: 'string' }
    },
    required: ['email', 'password', 'anonymousId'],
    additionalProperties: false
  },
  postFacebook: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      name: { type: 'string' },
      accessToken: { type: 'string' },
      picture: { type: 'object' },
      signedRequest: { type: 'string' },
      userID: { type: 'string' },
      closet: { type: 'closet' }
    },
    required: ['email', 'name', 'accessToken', 'signedRequest', 'userID']
  },
  forgot: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' }
    },
    required: ['email']
  },
  forgotValidate: {
    type: 'object',
    properties: {
      token: { type: 'string' }
    },
    required: ['token']
  },
  adminValidate: {
    type: 'object',
    properties: {
      token: { type: 'string' }
    },
    required: ['token']
  },
  authenticateEmailUser: {
    type: 'object',
    properties: {
      emails: { type: 'array' }
    },
    required: ['emails'],
    additionalProperties: false
  }
}
