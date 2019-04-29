/**
 *  FETCH CATEGORIES
 */

export const getCategories = () => ({
 type: 'GET_CATEGORIES_REQUEST',
})

export const getCategoriesSuccess = payload => ({
  type: 'GET_CATEGORIES_SUCCESS',
  payload
})

export const getCategoriesFailure = error => ({
  type: 'GET_CATEGORIES_FAILURE',
  error,
})

/**
 *  GET CLOTH
 */

export const getCloth = clothId => ({
  type: 'GET_CLOTH_REQUEST',
  clothId,
})

export const getClothSuccess = payload => ({
  type: 'GET_CLOTH_SUCCESS',
  payload,
})

export const getClothFailure = error => ({
  type: 'GET_CLOTH_FAILURE',
  error,
})

/**
 *  GET CLOTHES BY QUERY
 */

export const getClothes = params => ({
  type: 'GET_CLOTHES_REQUEST',
  params,
})

export const getClothesSuccess = payload => ({
 type: 'GET_CLOTHES_SUCCESS',
 payload,
})

export const getClothesFailure = error => ({
 type: 'GET_CLOTHES_FAILURE',
 error,
})
