import { schema } from 'normalizr'

const ProductSchema = new schema.Entity('products', {}, {
  idAttribute: '_id',
  mergeStrategy: (entityA, entityB) => ({
    ...entityA,
    ...entityB,
  }),
})

export default ProductSchema
