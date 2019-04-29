module.exports = {
  createPO: {
    type: 'object',
    properties: {
      cartId: { type: 'string' }
    },
    additionalProperties: false,
    required: ['cartId']
  }
}
