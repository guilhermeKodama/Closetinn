module.exports = {
  pageView: {
    type: 'object',
    properties: {
      user: { type: 'string' },
      url: { type: 'string' }
    },
    additionalProperties: false,
    required: ['user', 'url']
  },
  saveClick: {
    type: 'object',
    properties: {
      user: { type: 'string' },
      product: { type: ['string', 'null'] },
      look: { type: ['string', 'null'] },
      event: { type: 'string' },
      url: { type: 'string' }
    },
    additionalProperties: false,
    required: ['user','product', 'look', 'event']
  }
}
