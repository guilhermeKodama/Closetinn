module.exports = {
  getQuery: {
    type: 'object',
    properties: {
      gender: { type: 'string' },
      parentCategory: { type: 'string' },
      subCategory: { type: 'string' },
      sites: { type: 'json', format: 'array' },
      sizes: { type: 'json', format: 'array' },
      brands: { type: 'json', format: 'array' },
      genders: { type: 'json', format: 'array' },
      offset: { type: 'string', format: 'integer' },
      priceMin: { type: 'string', format: 'number' },
      priceMax: { type: 'string', format: 'number' },
      currentPage: { type: 'string', format: 'integer' }
    },
    additionalProperties: false,
    required: ['currentPage', 'offset']
  },
  getFilterQuery: {
    type: 'object',
    properties: {
      gender: { type: 'string'},
      parentCategory: { type: 'string' },
      subCategory: { type: 'string' },
      sites: { type: 'json', format: 'array' },
      sizes: { type: 'json', format: 'array' },
      brands: { type: 'json', format: 'array' },
      genders: { type: 'json', format: 'array' },
      offset: { type: 'string', format: 'integer' },
      priceMin: { type: 'string', format: 'number' },
      priceMax: { type: 'string', format: 'number' },
      currentPage: { type: 'string', format: 'integer' }
    },
    additionalProperties: false
  },
  getCategoriesQuery: {
    type: 'object',
    properties: {
      parentCategory: { type: 'string' },
      subCategory: { type: 'string' },
      sites: { type: 'json', format: 'array' },
      sizes: { type: 'json', format: 'array' },
      brands: { type: 'json', format: 'array' },
      offset: { type: 'string', format: 'integer' },
      priceMin: { type: 'string', format: 'number' },
      priceMax: { type: 'string', format: 'number' },
      currentPage: { type: 'string', format: 'integer' }
    },
    additionalProperties: false
  }
}
