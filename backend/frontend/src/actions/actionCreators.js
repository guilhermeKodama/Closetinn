import axios from '../utils/axios'

/**
 * LOGIN
 */

export const requestAuth = () => ({
  type: 'REQUEST_AUTH'
})

const requestAuthSuccess = json => ({
  type: 'REQUEST_AUTH_SUCCESS',
  token: json.token
})

const requestAuthFailure = error => ({
  type: 'REQUEST_AUTH_FAILURE',
  error: error.message
})

export const authenticate = cb => (
  dispatch => {
    dispatch(requestAuth())

    return axios('/auth/unknown',
    {
        method: 'post',
     })
     .then((response) => {
       return dispatch(requestAuthSuccess(response.data))
     })
     .catch(error => {
       return dispatch(requestAuthFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * UPDATE
 */

const requestUserUpdate = () => ({
 type: 'USER_UPDATE_REQUEST'
})

const receiveUserUpdate = json => ({
 type: 'USER_UPDATE_SUCCESS',
 json
})

const requestUserUpdateFailed = error => ({
 type: 'USER_UPDATE_FAILURE',
 error: error.message
})

export const updateUser = (user, data) => (
  dispatch => {
    dispatch(requestUserUpdate())

    return axios(`/users/${user._id}`,
    {
        method: 'put',
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
     })
     .then((response) => {
       return dispatch(receiveUserUpdate(response.data))
     })
     .catch(error => {
       return dispatch(requestUserUpdateFailed(error.message || 'Error during request.'))
     })
  }
)

/**
 * GET RECOMMENDATIONS
 */

const recommendationBasedOnDescriptionRequest = () => ({
 type: 'RECOMMENDATION_BASED_ON_DESCRIPTION_REQUEST'
})

const recommendationBasedOnDescriptionSuccess = (json, productId) => ({
 type: 'RECOMMENDATION_BASED_ON_DESCRIPTION_SUCCESS',
 products: json.products,
 productId
})

const recommendationBasedOnDescriptionFailure = error => ({
 type: 'RECOMMENDATION_BASED_ON_DESCRIPTION_FAILURE',
 error: error.message || 'Something went wrong.'
})

export const getRecommendationBasedOnDescription = productId => (
  dispatch => {
    dispatch(recommendationBasedOnDescriptionRequest())

    return axios(`/recommendation/text/${productId}`,
    {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
     }).then(response => {
       const data = response.data
       return dispatch(recommendationBasedOnDescriptionSuccess(data, data.productId))
      }).catch(error => {
        console.log('ERROR:', error)
        return dispatch(recommendationBasedOnDescriptionFailure(error.message || 'Error during request.'))
      })
  }
)

/**
 *  GET SEARCH PRODUCTS
 */

export const searchClear = () => ({
 type: 'SEARCH_CLEAR'
})

export const searchRequest = query => ({
  type: 'SEARCH_REQUEST',
  query
})

export const searchSuccess = json => ({
  type: 'SEARCH_SUCCESS',
  products: json.products
})

export const searchFailure = error => ({
  type: 'SEARCH_FAILURE',
  error: error.message || 'Something Went Wrong'
})

/**
 *  WISHLIST
 */

const requestAddProductToWishlist = () => ({
 type: 'REQUEST_ADD_PRODUCT_TO_WISHLIST'
})

const receiveAddProductToWishlist = json => ({
 type: 'RECEIVE_ADD_PRODUCT_TO_WISHLIST',
 id: json._id,
 name: json.name,
 email: json.email,
 token: json.token,
 closet: json.closet
})

const requestAddProductToWishlistFailed = error => ({
 type: 'REQUEST_ADD_PRODUCT_TO_WISHLIST_FAILED',
 error: error.message
})

export const addProductToWishlist = product => (
  (dispatch, getState) => {
    dispatch(requestAddProductToWishlist())

    const user = getState().user
    return axios(`/users/${user._id}/closet/`,
    {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.token
        },
        data: JSON.stringify({
          userId: user._id,
          product: product
        })
     })
      .then(response => {
        return dispatch(receiveAddProductToWishlist(response.data))
      })
      .catch(error => {
        const errorMessage = { message: error.message || 'Error during request.' }
        return dispatch(requestAddProductToWishlistFailed(errorMessage))
      })
  }
)

const requestRemoveProductFromWishlist = () => ({
 type: 'REQUEST_REMOVE_PRODUCT_FROM_WISHLIST'
})

const receiveRemoveProductFromWishlist = json => ({
 type: 'RECEIVE_REMOVE_PRODUCT_FROM_WISHLIST',
 id: json._id,
 name: json.name,
 email: json.email,
 token: json.token,
 closet: json.closet
})

const requestRemoveProductFromWishlistFailed = error => ({
 type: 'REQUEST_REMOVE_PRODUCT_FROM_WISHLIST_FAILED',
 error: error.message
})

export const removeProductFromWishlist = productId => (
  (dispatch, getState) => {
    dispatch(requestRemoveProductFromWishlist())

    const user = getState().user
    return axios(`/users/${user._id}/closet/${productId}`,
    {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.token
        },
        data: JSON.stringify({ userId: user._id})
     })
      .then(response => {
        return dispatch(receiveRemoveProductFromWishlist(response.data))
      })
      .catch(error => {
        const errorMessage = { message: error.message || 'Error during request.' }
        return dispatch(requestRemoveProductFromWishlistFailed(errorMessage))
      })
  }
)

const requestGetUserWishList = () => ({
 type: 'REQUEST_GET_USER_WISHLIST'
})

const receiveUserWishlist = json => ({
 type: 'RECEIVE_USER_WISHLIST',
 pagination: json.pagination,
 closet: json.closet
})

const requestGetUserWishlistFailed = error => ({
 type: 'REQUEST_GET_USER_WISHLIST_FAILED',
 error: error.message
})

export const getUserWishlist = (currentPage, user) => (
  dispatch => {
    dispatch(requestGetUserWishList())

    return axios(`/users/${user._id}/closet?currentPage=${currentPage}&offset=21`,
    {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.token
        }
     })
      .then(response => {
        return dispatch(receiveUserWishlist(response.data))
      })
      .catch(error => {
        const errorMessage = { message: error.message || 'Error during request.' }
        return dispatch(requestGetUserWishlistFailed(errorMessage))
      })
  }
)

/**
 *  FORGOT PASSWORD
 */

const requestForgotPassword = () => ({
 type: 'REQUEST_FORGOT_PASSWORD'
})

const receiveForgotPassword = () => ({
 type: 'RECEIVE_FORGOT_PASSWORD'
})

const requestForgotPasswordFailed = error => ({
 type: 'REQUEST_FORGOT_PASSWORD_FAILED',
 error: error.message
})

export const forgotPassword = data => (
  dispatch => {
    dispatch(requestForgotPassword())

    return axios(`/auth/forgot`,
    {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
     })
     .then(response => {
       return dispatch(receiveForgotPassword())
      })
      .catch(error => {
        const errorMessage = { message: error.message || 'Error during request.' }
        return dispatch(requestForgotPasswordFailed(errorMessage))
      })
  }
)

/**
 *  CHECK FORGOT PASSWORD TOKEN
 */

const requestIsForgotPasswordTokenValid = () => ({
 type: 'REQUEST_IS_FORGOT_PASSWORD_TOKEN_VALID'
})

const receiveIsForgotPasswordTokenValid = json => ({
 type: 'RECEIVE_IS_FORGOT_PASSWORD_TOKEN_VALID',
 email: json.email
})

const requestIsForgotPasswordTokenValidFailed = error => ({
 type: 'REQUEST_IS_FORGOT_PASSWORD_TOKEN_VALID_FAILED',
 error: error.message
})

export const isForgotPasswordTokenValid = data => (
  dispatch => {
    dispatch(requestIsForgotPasswordTokenValid())

    return axios(`/auth/forgot/validate`,
    {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
     })
      .then(response => {
        return dispatch(receiveIsForgotPasswordTokenValid(response.data))
      })
      .catch(error => {
        const errorMessage = { message: error.message || 'Error during request.' }
        return dispatch(requestIsForgotPasswordTokenValidFailed(errorMessage))
      })
  }
)

/**
 *  CHECK FORGOT PASSWORD TOKEN
 */

const requestResetPassword = () => ({
  type: 'REQUEST_RESET_PASSWORD'
})

const receiveResetPassword = () => ({
  type: 'RECEIVE_RESET_PASSWORD'
})

const requestResetPasswordFailed = error => ({
  type: 'REQUEST_RESET_PASSWORD_FAILED',
  error: error.message
})

export const resetPassword = (email, data) => (
  dispatch => {
    dispatch(requestResetPassword())

    return axios(`/users/${email}/password/reset`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        }
     })
      .then(response => {
        return dispatch(receiveResetPassword())
      })
      .catch(error => {
        const errorMessage = { message: error.message || 'Error during request.' }
        return dispatch(requestResetPasswordFailed(errorMessage))
      })
  }
)
