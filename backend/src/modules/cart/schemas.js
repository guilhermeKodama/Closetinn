module.exports = {
  createCart: {
    type: 'object',
    properties: {
      anonymousId: { type: 'string' }
    },
    additionalProperties: false,
    required: ['anonymousId']
  },
  addClothToCart: {
    type: 'object',
    properties: {
      anonymousId: { type: 'string' },
      product: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          size: { type: 'string' },
          quantity: { type: 'integer' }
        },
        required: ['_id', 'size', 'quantity']
      },
    },
    additionalProperties: false,
    required: ['product']
  },
  updateCartProductOrder: {
    type: 'object',
    properties: {
      anonymousId: { type: 'string' },
      product: {
        type: 'object',
        properties: {
          size: { type: 'string' },
          quantity: { type: 'integer' },
          newSize: { type: 'string' }
        },
        required: [ 'size', 'quantity', 'newSize']
      }
    },
    additionalProperties: false,
    required: ['product']
  },
  removeProductFromCart: {
    type: 'object',
    properties: {
      anonymousId: { type: 'string' },
      product: {
        type: 'object',
        properties: {
          size: { type: 'string' }
        },
        required: ['size']
      }
    },
    additionalProperties: false,
    required: ['product']
  },
  updateCart: {
    type: 'object',
    properties: {
      address: {
        type: 'object',
        properties: {
          postcode: { type: 'string' },
          street: { type: 'string' },
          neighborhood: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          streetNumber: { type: 'string' },
          complement: { type: 'string' },
          reference: { type: 'string' },
          phone: { type: 'string' }
        },
        additionalProperties: false,
        required: ['postcode', 'street', 'neighborhood', 'city', 'state', 'streetNumber', 'reference', 'phone']
      },
      creditCard: {
        type: 'object',
        properties: {
          number: { type: 'string' },
          holder: { type: 'string' },
          expirationMonth: { type: 'integer' },
          expirationYear: { type: 'integer' },
          securityCode: { type: 'string' }
        },
        additionalProperties: false,
        required: ['number', 'holder', 'expirationMonth', 'expirationYear', 'securityCode']
      }
    },
    additionalProperties: false
  }
}
