module.exports = {
  getLooks: {
    type: 'object',
    properties: {
      offset: { type: 'string', format: 'integer' },
      page: { type: 'string', format: 'integer' }
    },
    additionalProperties: false,
    required: ['page', 'offset']
  },
  createLook: {
    type: 'object',
    properties: {
      products: { type: 'string' }
    },
    additionalProperties: false,
    required: ['products']
  },
}
