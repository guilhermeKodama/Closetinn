import { schema } from 'normalizr'
import ProductSchema from './product'

const LookSchema = new schema.Entity('looks', {}, {
  idAttribute: '_id',
  mergeStrategy: (entityA, entityB) => ({
    ...entityA,
    ...entityB,
  }),
})

LookSchema.define({
  products: [ProductSchema],
})

export default LookSchema
