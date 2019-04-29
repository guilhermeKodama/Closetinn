import { call, put, takeEvery, select, fork } from 'redux-saga/effects'
import { normalize } from 'normalizr'

import ProductSchema from '../../schemas/product'

import { history } from '../../routers/AppRouter'

import axios from '../../utils/axios'

import { GET_RECOMMENDATION_PROMOTIONS } from './constants'
import { MERGE_PRODUCTS } from '../entities/constants'

import { setLoading, setSnackbar } from '../app/actions'
import { userIdSelector } from '../user/selectors'

function* getRecommendationPromotions(action) {
  try {
    yield put(setLoading(true))
    const { payload: { recommendationId } } = action
    const userId = yield select(userIdSelector())
    const { data } = yield call(axios.get, `/users/${userId}/recommendations/promotions/${recommendationId}`, action.payload)
    const { entities, result } = normalize(data.products, [ProductSchema])
    yield put({ type: MERGE_PRODUCTS.ACTION, payload: entities })
    yield put({ type: GET_RECOMMENDATION_PROMOTIONS.SUCCESS, payload: { products: result } })
  } catch (e) {
    yield put(setSnackbar({ open: true, variant: 'error', message: 'Ocorreu um erro no servidor!' }))
    yield put({ type: GET_RECOMMENDATION_PROMOTIONS.FAILED, message: e.message || e })
    yield call(history.push, '/NotFound')
  } finally {
    yield put(setLoading(false))
  }
}

function* getRecommendationPromotionsWatcher() {
  yield takeEvery(GET_RECOMMENDATION_PROMOTIONS.ACTION, getRecommendationPromotions)
}

export default function* root() {
  yield fork(getRecommendationPromotionsWatcher)
}
