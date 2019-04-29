import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import LookSchema from '../../schemas/look'

export const stateSelector = () => state => state
export const lookDataSelector = () => state => state.looks.data
export const lookErrorSelector = () => state => state.looks.error

export const looksSelector = () => createSelector(
  stateSelector(),
  ({
    looks: { data: { looks } },
    entities,
  }) => denormalize(looks, [LookSchema], entities)
)

export const paginationSelector = () => createSelector(
  lookDataSelector(),
  ({ pagination }) => pagination,
)

export const lookSelector = () => createSelector(
  stateSelector(),
  ({
    looks: { data: { look } },
    entities,
  }) => denormalize(look, LookSchema, entities)
)
