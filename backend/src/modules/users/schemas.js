module.exports = {
  post: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      name: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['email', 'password'],
    additionalProperties: false
  },
  put: {
    type: 'object',
    properties: {
      myCloset: { type: 'array' },
      sizes: { type: 'object' },
      budget: { type: 'object' },
      appearence: { type: 'object' },
      recommendations: { type: 'object' },
      email: { type: 'string' },
      name: { type: 'string' },
      password: { type: 'string'}
    },
    additionalProperties: false
  },
  postFolder: {
    type: 'object',
    properties: {
      folderName: { type: 'string' }
    },
    required: ['folderName']
  },
  putFolder: {
    type: 'object',
    properties: {
      folderName: { type: 'string' },
      description: { type: 'string' }
    }
  },
  addProductToWishlist: {
    type: 'object',
    properties: {
      productId: { type: 'string' }
    },
    required: ['productId']
  },
  resetPassword: {
    type: 'object',
    properties: {
      newPassword: { type: 'string' },
      token: { type: 'string' }
    },
    required: ['newPassword', 'token']
  },
  unsubscribe: {
    type: 'object',
    properties: {
      reasons: { type: 'array' },
      suggestion: { type: 'string' }
    },
    additionalProperties: false
  }
}
