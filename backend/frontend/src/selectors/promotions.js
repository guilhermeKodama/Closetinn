import { createSelector } from 'reselect'

export const promotionsDataSelector = () => state => state.promotions.data

export const promotionsSelector = () => createSelector(
  promotionsDataSelector(),
  ({ promotions }) => promotions,
)

export const clothesSelector = () => createSelector(
  promotionsDataSelector(),
  ({ clothes }) => clothes,
)

export const filtersSelector = () => createSelector(
  promotionsDataSelector(),
  ({ filters }) => filters,
)

export const paginationSelector = () => createSelector(
  promotionsDataSelector(),
  ({ pagination }) => pagination,
)
