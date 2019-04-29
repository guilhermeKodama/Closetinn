module.exports = {
  getPromotion: {
    type: 'object',
    properties: {
      offset: { type: 'string', format: 'integer' },
      currentPage: { type: 'string', format: 'integer' },
      sites: { type: 'json', format: 'array' },
      sizes: { type: 'json', format: 'array' },
      brands: { type: 'json', format: 'array' },
      genders: { type: 'json', format: 'array' },
      priceMin: { type: 'string', format: 'number' },
      priceMax: { type: 'string', format: 'number' },
    },
    additionalProperties: false,
    required: ['currentPage', 'offset']
  },
  getPromotions: {
    type: 'object',
    properties: {
      offset: { type: 'string', format: 'integer' },
      currentPage: { type: 'string', format: 'integer' }
    },
    additionalProperties: false,
    required: ['currentPage', 'offset']
  }
}
