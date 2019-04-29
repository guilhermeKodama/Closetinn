module.exports = {
  createSubscription: {
    type: 'object',
    properties: {
      email: { type: 'string' }
    },
    additionalProperties: false,
    required: ['email']
  }
}
