require('babel-register')
import fs from 'fs'
import { ObjectID } from 'mongodb'
import Cloth from '../src/models/cloth'

let result = (async function() {
  const categories = {}
  const products = await Cloth.find({ origin: 'zanox', site: 'dafiti', priceDiscount: { '$nin': [ null ] } }, { categories: 1, priceDiscount: 1 })
  products.forEach((product) => {
    if (product.categories.length === 3) {
      if (categories[product.categories[2]]) {
        // categories[product.categories[2]].data.push(product)
        if (categories[product.categories[2]].biggestDiscount < product.priceDiscount) {
          categories[product.categories[2]].biggestDiscount = product.priceDiscount
        }
      } else {
        categories[product.categories[2]] = {
          // data: [ product ],
          biggestDiscount: product.priceDiscount
        }
      }
    }
  })
  fs.writeFile('discountsReport.json', JSON.stringify(categories, null, 4))
})()
