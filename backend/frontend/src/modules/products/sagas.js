import { call, put, takeLatest, select, fork } from 'redux-saga/effects'
import { normalize } from 'normalizr'

import ProductSchema from '../../schemas/product'

import axios from '../../utils/axios'

import { MERGE_PRODUCTS } from '../entities/constants'
import {
  LIKE_PRODUCT,
  DISLIKE_PRODUCT,
} from './constants'

import { setSnackbar } from '../app/actions'
import { userIdSelector } from '../user/selectors'

function* likeProduct(action) {
    try {
      const { payload: { productId } } = action
      const userId = yield select(userIdSelector())
      const { data } = yield call(axios.post, `/users/${userId}/products/${productId}/like`)
      data._id = productId
      const { entities } = normalize(data, ProductSchema)
      yield put({ type: MERGE_PRODUCTS.ACTION, payload: entities })
      yield put({ type: LIKE_PRODUCT.SUCCESS })
    } catch (e) {
      yield put(setSnackbar({ open: true, variant: 'error', message: 'Ocorreu um erro no servidor!' }))
      yield put({ type: LIKE_PRODUCT.FAILED, message: e.message || e })
    }
  }
  
  function* dislikeProduct(action) {
    try {
      const { payload: { productId } } = action
      const userId = yield select(userIdSelector())
      const { data } = yield call(axios.post, `/users/${userId}/products/${productId}/dislike`)
      data._id = productId
      const { entities } = normalize(data, ProductSchema)
      yield put({ type: MERGE_PRODUCTS.ACTION, payload: entities })
      yield put({ type: DISLIKE_PRODUCT.SUCCESS })
    } catch (e) {
      yield put(setSnackbar({ open: true, variant: 'error', message: 'Ocorreu um erro no servidor!' }))
      yield put({ type: DISLIKE_PRODUCT.FAILED, message: e.message || e })
    }
  }

  function* likeProductWatcher() {
    yield takeLatest(LIKE_PRODUCT.ACTION, likeProduct)
  }
  
  function* dislikeProductWatcher() {
    yield takeLatest(DISLIKE_PRODUCT.ACTION, dislikeProduct)
  }

  export default function* root() {
    yield fork(likeProductWatcher)
    yield fork(dislikeProductWatcher)
  }