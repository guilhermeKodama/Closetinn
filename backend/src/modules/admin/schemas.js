module.exports = {
  getUnclassifiedClothesQuery: {
    type: 'object',
    properties: {
      offset: { type: 'string', format: 'integer' },
      currentPage: { type: 'string', format: 'integer' }
    },
    additionalProperties: false,
    required: ['currentPage', 'offset']
  },
  putUnclassifiedCloth: {
    type: 'object',
    properties: {
      moveToClothesCollection: { type: 'boolean' },
      description: { type: 'string' },
      title: { type: 'string' },
      url: { type: 'string' },
      gender: { type: 'string' },
      price: { type: 'float' },
      priceOld: { type: 'float' },
      priceDiscount: { type: 'float' },
      sizes: { type: 'array' },
      image_medium_url: { type: 'string' },
      images_urls: { type: 'array' },
      productName: { type: 'string' },
      disabled: { type: 'boolean' },
      site: { type: 'string' },
      brand: { type: 'string' },
      trackingUrl: { type: 'string' },
      categories: { type: 'array' },
      categoriesOrigin: { type: 'array' }
    },
    additionalProperties: false,
    required: [
      'moveToClothesCollection',
      'description',
      'title',
      'url',
      'gender',
      'price',
      'sizes',
      'image_medium_url',
      'images_urls',
      'productName',
      'disabled',
      'site',
      'brand',
      'trackingUrl',
      'categories',
      'categoriesOrigin'
    ]
  }
}
