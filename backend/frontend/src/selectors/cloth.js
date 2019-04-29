import { createSelector } from 'reselect'

export const clothesSelector = () => state => state.clothes.data

export const categoriesSelector = () => createSelector(
  clothesSelector(),
  ({ categories }) => categories,
)
