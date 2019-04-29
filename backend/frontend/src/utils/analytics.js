export const productImpressions = (products, list) => {
  window.dataLayer.push({
    'ecommerce': {
      'currencyCode': 'BRL',                       // Local currency is optional.
      'impressions': products.map(product => {
        return {
          'name': product.productName,
          'id': product._id,
          'price': product.price,
          'brand': product.brand,
          'category': product.categories.join('/'),
          list,
        }
      })
    }
  })
}

export const productClick = (product, index, lookIndex, list) => {
  window.dataLayer.push({
    'event': 'productClick',
    'ecommerce': {
      'currencyCode' : 'BRL',
      'click': {
        'actionField': { list },
        'products': [{
          'name': product.productName,
          'id': product._id,
          'price': product.price,
          'brand': product.brand,
          'category': product.categories.join('/'),
          'position': index,
          'metric1': lookIndex,
        }],
      },
    },
  })
}

export const likeProduct = (product, index, lookIndex, list) => {
  window.dataLayer.push({
    'event': 'likeProduct',
    'ecommerce': {
      'currencyCode' : 'BRL',
      'click': {
        'actionField': { list },
        'products': [{
          'name': product.productName,
          'id': product._id,
          'price': product.price,
          'brand': product.brand,
          'category': product.categories.join('/'),
          'position': index,
          'metric1': lookIndex,
         }]
       }
     },
  })
}

export const dislikeProduct = (product, index, lookIndex, list) => {
  window.dataLayer.push({
    'event': 'dislikeProduct',
    'ecommerce': {
      'currencyCode' : 'BRL',
      'click': {
        'actionField': { list },
        'products': [{
          'name': product.productName,
          'id': product._id,
          'price': product.price,
          'brand': product.brand,
          'category': product.categories.join('/'),
          'position': index,
          'metric1': lookIndex,
         }]
       }
     },
  })
}

export const likeLook = (lookId, index, list) => {
  window.dataLayer.push({
    'event': 'likeLook',
    'ecommerce': {
      'click': {
        'actionField': { list },
        'products': [{
          'id': lookId,
          'name': lookId,
          'position': index,
         }]
       }
     },
  })
}

export const dislikeLook = (lookId, index, list) => {
  window.dataLayer.push({
    'event': 'dislikeLook',
    'ecommerce': {
      'click': {
        'actionField': { list },
        'products': [{
          'id': lookId,
          'name': lookId,
          'position': index,
         }]
       }
     },
  })
}
