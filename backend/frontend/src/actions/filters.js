/**
 *  GET AVAILABLE FILTERS BY CLOTHES
 */

export const getFilters = params => ({
  type: 'GET_FILTERS_REQUEST',
  params
})

export const getFiltersSuccess = payload => ({
 type: 'GET_FILTERS_SUCCESS',
 payload,
})

export const getFiltersFailure = error => ({
 type: 'GET_FILTERS_FAILURE',
 error,
})

/**
 *  FILTERS
 */

export const setFilter = payload => ({
  type: 'SET_FILTER',
  payload,
})

export const setFilterPrice = payload => ({
  type: 'SET_FILTER_PRICE',
  payload,
})

export const removeFilter = payload => ({
  type: 'REMOVE_FILTER',
  payload,
})

/**
 *  CLEAR FILTER
 */

export const clearFilter = () => ({
  type: 'CLEAR_FILTER',
})
