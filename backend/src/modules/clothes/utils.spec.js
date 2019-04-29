import chai from 'chai'
import sinon from 'sinon'
import utils from './utils'
const should = chai.should()

describe.skip('Products Utils', () => {
  describe('transformQueryInMongoFilters', () => {
    it('Should transform a simple filter with parentCategory and pagination', () => {
      const query = {
        offset:10,
        currentPage:1,
        parentCategory: 'Roupas'
      }

      const filters = utils.transformQueryInMongoFilters(query)
      filters.should.be.deep.equal({
        disabled: false,
        'categories.1': 'Roupas'
      })
    })

    it('Should transform a brand query into a valid filter', () => {
      const query = {
        offset:10,
        currentPage:1,
        parentCategory: 'Roupas',
        brands: '["Colcci"]'
      }

      const filters = utils.transformQueryInMongoFilters(query)
      filters.should.be.deep.equal({
        disabled: false,
        'categories.1': 'Roupas',
        brand: { '$in': [ 'colcci' ] }
      })
    })

    it('Should transform a price query into a valid filter', () => {
      const query = {
        offset:10,
        currentPage:1,
        parentCategory: 'Roupas',
        priceMin: '10',
        priceMax: '100'
      }

      const filters = utils.transformQueryInMongoFilters(query)
      filters.should.be.deep.equal({
        disabled: false,
        'categories.1': 'Roupas',
        price: {
          '$gte': 10,
          '$lte': 100
        }
      })
    })

    it('Should transform a sizes query into a valid filter', () => {
      const query = {
        offset:10,
        currentPage:1,
        parentCategory: 'Roupas',
        sizes: '["40", "42"]'
      }

      const filters = utils.transformQueryInMongoFilters(query)
      filters.should.be.deep.equal({
        disabled: false,
        'categories.1': 'Roupas',
        sizes: { '$in': [ '40', '42' ] }
      })
    })

    it('Should transform a sites query into a valid filter', () => {
      const query = {
        offset:10,
        currentPage:1,
        parentCategory: 'Roupas',
        sites: '["dafiti", "passarela"]'
      }

      const filters = utils.transformQueryInMongoFilters(query)
      filters.should.be.deep.equal({
        disabled: false,
        'categories.1': 'Roupas',
        site: { '$in': [ 'dafiti', 'passarela' ] }
      })
    })

    it('Should transform a genders query into a valid filter', () => {
      const query = {
        offset:10,
        currentPage:1,
        parentCategory: 'Roupas',
        genders: '["feminino", "infatil"]'
      }

      const filters = utils.transformQueryInMongoFilters(query)
      filters.should.be.deep.equal({
        disabled: false,
        'categories.1': 'Roupas',
        gender: { '$in': [ 'feminino', 'infatil' ] }
      })
    })

    it('Should transform a secondaryCategory query into a valid filter', () => {
      const query = {
        offset:10,
        currentPage:1,
        parentCategory: 'Roupas',
        subCategory: 'Vestidos'
      }

      const filters = utils.transformQueryInMongoFilters(query)
      filters.should.be.deep.equal({
        disabled: false,
        'categories.1': 'Roupas',
        'categories.2': 'Vestidos'
      })
    })
  })
})
