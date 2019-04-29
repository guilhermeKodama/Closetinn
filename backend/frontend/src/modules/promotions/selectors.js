import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import ProductSchema from '../../schemas/product'

export const stateSelector = () => state => state

export const promotionsSelector = () => createSelector(
  stateSelector(),
  ({
    promotions: { data: { products } },
    entities,
  }) => denormalize(products, [ProductSchema], entities)
)
