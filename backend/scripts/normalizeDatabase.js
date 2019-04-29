require('babel-register')
import fs from 'fs'
import { ObjectID } from 'mongodb'
import Cloth from '../src/models/cloth'

let result = (async function() {
  const data = {}
  const all = await Cloth.find({ site: 'dafiti', origin: 'zanox' }, { _id:1, categories: 1, brand: 1 })
  for(let i = 0; i < all.length; i++) {
    const doc = all[i]
    const categories = doc.categories.map((category) => category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
    categories.forEach((c) => {
      data[c] ? data[c] = data[c] + 1 : data[c] = 1
    })
    doc.categories = categories
    doc.brand = doc.brand && doc.brand.toLowerCase()
    console.log(doc.toJSON().categories)
    try {
      await doc.save()
    } catch(e) {
      console.log('fuck it')
      console.log(doc.origin)
      await Cloth.findOneAndRemove({ _id: new ObjectID(doc._id) })
    }
  }
  fs.writeFile('categories.json', JSON.stringify(data))
})()
