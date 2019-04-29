const categoriesUtils = require('../../utils/categories')

//TODO TEMPORARY
const filterMissingData = { sizes: { $nin:[''] }, 'sizes.0': { $exists: true } }

module.exports = {
  transformQueryInMongoFilters: (query) => {
    if(!query || !Object.keys(query).length) return {}

    let options = {}
    let parentCategory = query.parentCategory && query.parentCategory
    const offset = query.offset && parseInt(query.offset)
    const currentPage = query.currentPage && parseInt(query.currentPage)
    let subCategory = query.subCategory && query.subCategory
    const site = query.site && query.site.toLowerCase()
    const gender = query.gender && categoriesUtils.normalizeCategory(query.gender)
    const priceMin = query.priceMin && parseInt(query.priceMin)
    const priceMax = query.priceMax && parseInt(query.priceMax)

    // simple mapping to help frontend
    if(parentCategory) {
      // normalize
      parentCategory = categoriesUtils.normalizeCategory(parentCategory)
      // default if no subCategory
      options = { disabled: false, categories: { '$in': [ parentCategory ] }}
    }

    // subCategory using text search
    if(subCategory) {
      subCategory = categoriesUtils.normalizeCategory(subCategory)
      options = { disabled: false,
        'categories.1': parentCategory,
        'categories.2': subCategory
      }
    }

    // brand filter
    if(query.brands) {
      try {
        let brands = JSON.parse(query.brands)
        if(!(brands instanceof Array)) throw new Error('Brands should be an JSON array')

        brands = brands.map((brand) => {
          return brand.toLowerCase()
        })

        // include in options
        options.brand = { '$in': [ ...brands ] }
      } catch(e) {
        throw new Error('Brands should be an JSON array')
      }
    }

    options.origin = 'zanox'

    // sites filter (enable only dafiti for now)
    options.site = 'dafiti'
    // if(query.sites) {
    //   try {
    //     let sites = JSON.parse(query.sites)
    //     if(!(sites instanceof Array)) throw new Error('Sites should be an JSON array')
    //
    //     sites = sites.map((site) => {
    //       return site.toLowerCase()
    //     })
    //
    //     // include in options
    //     options.site = { '$in': [ ...sites ] }
    //   } catch(e) {
    //     throw new Error('Sites should be an JSON array')
    //   }
    // }

    // gender filter
    if(gender) {
      try {
        options.gender = { '$in': [ gender ] }
      } catch(e) {
        throw new Error('Fail setting gender filter')
      }
    } else if(query.genders) {
      try {
        let genders = JSON.parse(query.genders)
        if(!(genders instanceof Array)) throw new Error('Genders should be an JSON array')

        genders = genders.map((gender) => {
          return gender.toLowerCase()
        })

        // include in options
        options.gender = { '$in': [ ...genders ] }
      } catch(e) {
        throw new Error('Genders should be an JSON array')
      }
    }

    // price range
    if(priceMin && priceMax) {
      if(priceMin > priceMax) throw new Error('Min price should be lower than max price')
      options.price = {
        '$gte': priceMin,
        '$lte': priceMax
      }
    }

    // check sizes
    if(query.sizes) {
      try {
        const sizes = JSON.parse(query.sizes)
        if(!(sizes instanceof Array)) throw new Error('Sizes should be an JSON array')

        // include in options
        options.sizes = { '$in': [ ...sizes ] }
      } catch(e) {
        throw new Error('Sizes should be an JSON array')
      }
    }

    // TODO TEMPORARY
    if (!options.sizes) options.sizes = {}
    options.sizes['$nin'] = filterMissingData.sizes['$nin']
    options['sizes.0'] = filterMissingData['sizes.0']

    return options
  }
}
