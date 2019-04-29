import axios from '../utils/axios'

/**
 * GET CART
 */

const getCartRequest = () => ({
  type: 'GET_CART_REQUEST'
})

const getCartSuccess = payload => ({
  type: 'GET_CART_SUCCESS',
  payload
})

const getCartFailure = error => ({
  type: 'GET_CART_FAILURE',
  error: error.message
})

export const getCart = () => (
  (dispatch, getState) => {
    dispatch(getCartRequest())

    const { cart: { _id: cartId } } = getState().user.data

    if (!cartId) return

    return axios(`cart/${cartId}`)
     .then(response => {
       return dispatch(getCartSuccess(response.data))
     }).catch(error => {
       return dispatch(getCartFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * CREATE CART
 */

const createCartRequest = () => ({
  type: 'CREATE_CART_REQUEST'
})

const createCartSuccess = payload => ({
  type: 'CREATE_CART_SUCCESS',
  payload
})

const createCartFailure = error => ({
  type: 'CREATE_CART_FAILURE',
  error: error.message
})

export const createCart = () => (
  (dispatch, getState) => {
    dispatch(createCartRequest())

    const { logged, anonymousId } = getState().user.data

    if (logged) return

    return axios(`/cart`,
    {
        method: 'post',
        data: JSON.stringify({ anonymousId }),
     })
     .then(response => {
       return dispatch(createCartSuccess(response.data))
     }).catch(error => {
       return dispatch(createCartFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * ADD CLOTH TO CART
 */

const addClothToCartRequest = () => ({
  type: 'ADD_CLOTH_TO_CART_REQUEST'
})

const addClothToCartSuccess = payload => ({
  type: 'ADD_CLOTH_TO_CART_SUCCESS',
  payload
})

const addClothToCartFailure = error => ({
  type: 'ADD_CLOTH_TO_CART_FAILURE',
  error: error.message
})

export const addClothToCart = product => (
  (dispatch, getState) => {
    dispatch(addClothToCartRequest())

    const { logged, anonymousId, cart: { _id: cartId } } = getState().user.data
    const data = logged ? JSON.stringify({ product }) : JSON.stringify({ anonymousId, product })

    return axios(`/cart/${cartId}/product`,
    {
        method: 'post',
        data,
     })
     .then(response => {
       return dispatch(addClothToCartSuccess(response.data))
     }).catch(error => {
       return dispatch(addClothToCartFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * UPDATE CLOTH CART
 */

const updateCartClothRequest = () => ({
  type: 'UPDATE_CART_CLOTH_REQUEST'
})

const updateCartClothSuccess = payload => ({
  type: 'UPDATE_CART_CLOTH_SUCCESS',
  payload
})

const updateCartClothFailure = error => ({
  type: 'UPDATE_CART_CLOTH_FAILURE',
  error: error.message
})

export const updateClothCart = (productId, product) => (
  (dispatch, getState) => {
    dispatch(updateCartClothRequest())

    const { logged, anonymousId, cart: { _id: cartId } } = getState().user.data
    const data = logged ? JSON.stringify({ product }) : JSON.stringify({ anonymousId, product })

    return axios(`/cart/${cartId}/product/${productId}`,
    {
        method: 'put',
        data,
     })
     .then(response => {
       return dispatch(updateCartClothSuccess(response.data))
     }).catch(error => {
       return dispatch(updateCartClothFailure(error.message || 'Error during request.'))
     })
  }
)


/**
 * REMOVE CLOTH FROM CART
 */

const removeClothFromCartRequest = () => ({
  type: 'REMOVE_CLOTH_FROM_CART_REQUEST'
})

const removeClothFromCartSuccess = payload => ({
  type: 'REMOVE_CLOTH_FROM_CART_SUCCESS',
  payload
})

const removeClothFromCartFailure = error => ({
  type: 'REMOVE_CLOTH_FROM_CART_FAILURE',
  error: error.message
})

export const removeClothFromCart = (productId, product) => (
  (dispatch, getState) => {
    dispatch(removeClothFromCartRequest())

    const { logged, anonymousId, cart: { _id: cartId } } = getState().user.data
    const data = logged ? JSON.stringify({ product }) : JSON.stringify({ anonymousId, product })

    return axios(`/cart/${cartId}/product/${productId}`,
    {
      method: 'delete',
      data,
    })
    .then(response => {
      return dispatch(removeClothFromCartSuccess(response.data))
     })
    .catch(error => {
      return dispatch(removeClothFromCartFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * UPDATE CART
 */

const updateCartRequest = () => ({
  type: 'UPDATE_CART_REQUEST'
})

const updateCartSuccess = payload => ({
  type: 'UPDATE_CART_SUCCESS',
  payload
})

const updateCartFailure = error => ({
  type: 'UPDATE_CART_FAILURE',
  error: error.message
})

export const updateCart = (body) => (
  (dispatch, getState) => {
    dispatch(updateCartRequest())

    const { logged, anonymousId, cart: { _id: cartId } } = getState().user.data
    const data = logged ? JSON.stringify({ ...body }) : JSON.stringify({ anonymousId, ...body })

    return axios(`/cart/${cartId}`,
    {
        method: 'put',
        data,
     })
     .then(response => {
       return dispatch(updateCartSuccess(response.data))
     }).catch(error => {
       return dispatch(updateCartFailure(error.message || 'Error during request.'))
     })
  }
)
