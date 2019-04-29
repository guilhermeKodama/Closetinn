module.exports = {
  search: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      offset: { type: 'string' },
      currentPage: { type: 'string' }
    },
    additionalProperties: false,
    required: ['query']
  },
  mlapiSearch: {
    type: 'object',
    properties: {
      query: { type: 'string' }
    },
    additionalProperties: false,
    required: ['query']
  },
  elasticSearch: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      offset: { type: 'string' },
      currentPage: { type: 'string' }
    },
    additionalProperties: false,
    required: ['query']
  }
}
