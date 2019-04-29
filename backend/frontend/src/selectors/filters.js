import { createSelector } from 'reselect'

export const filtersDataSelector = () => state => state.filters.data

export const filtersSelector = () => createSelector(
  filtersDataSelector(),
  ({ filters }) => filters,
)

export const selectedFiltersSelector = () => createSelector(
  filtersDataSelector(),
  ({ selectedFilters }) => selectedFilters,
)
