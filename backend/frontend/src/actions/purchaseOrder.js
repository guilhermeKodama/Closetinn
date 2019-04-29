import axios from '../utils/axios'

/**
 * GET PURCHASE ORDERS
 */

const getPurchaseOrdersRequest = () => ({
 type: 'GET_PURCHASE_ORDERS_REQUEST'
})

const getPurchaseOrdersSuccess = payload => ({
 type: 'GET_PURCHASE_ORDERS_SUCCESS',
 payload,
})

const getPurchaseOrdersFailure = error => ({
 type: 'GET_PURCHASE_ORDERS_FAILURE',
 error: error.message
})

export const getPurchaseOrders = () => (
  dispatch => {
    dispatch(getPurchaseOrdersRequest())

    return axios('/purchaseOrders')
    .then(response => {
      return dispatch(getPurchaseOrdersSuccess(response.data))
     }).catch(error => {
       return dispatch(getPurchaseOrdersFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * CANCEL PURCHASE ORDERS
 */

const cancelPurchaseOrderRequest = () => ({
 type: 'CANCEL_PURCHASE_ORDER_REQUEST'
})

const cancelPurchaseOrderSuccess = payload => ({
 type: 'CANCEL_PURCHASE_ORDER_SUCCESS',
 payload,
})

const cancelPurchaseOrderFailure = error => ({
 type: 'CANCEL_PURCHASE_ORDER_FAILURE',
 error: error.message
})

export const cancelPurchaseOrder = id => (
  dispatch => {
    dispatch(cancelPurchaseOrderRequest())

    return axios(`/purchaseOrders/${id}/cancel`,
    {
      method: 'put'
    })
    .then(response => {
      return dispatch(cancelPurchaseOrderSuccess(response.data))
     }).catch(error => {
       return dispatch(cancelPurchaseOrderFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * CREATE PURCHASE ORDER
 */

const createPurchaseOrderRequest = () => ({
 type: 'CREATE_PURCHASE_ORDER_REQUEST'
})

const createPurchaseOrderSuccess = payload => ({
 type: 'CREATE_PURCHASE_ORDER_SUCCESS',
 payload,
})

const createPurchaseOrderFailure = error => ({
 type: 'CREATE_PURCHASE_ORDER_FAILURE',
 error: error.message
})

export const createPurchaseOrder = cartId => (
  dispatch => {
    dispatch(createPurchaseOrderRequest())

    return axios(`/purchaseOrders`,
    {
      method: 'post',
      data: JSON.stringify({ cartId })
    })
    .then(response => {
      return dispatch(createPurchaseOrderSuccess(response.data))
     }).catch(error => {
       return dispatch(createPurchaseOrderFailure(error.message || 'Error during request.'))
     })
  }
)
