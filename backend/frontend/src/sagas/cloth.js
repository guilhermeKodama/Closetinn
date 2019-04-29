import { call, put, take, takeLatest, select, fork } from 'redux-saga/effects'

import axios from '../utils/axios'
import { objectToParams } from '../utils/http'

import { setLoading } from '../actions/app'
import {
  searchSuccess,
  searchFailure
} from '../actions/actionCreators'
import {
  getCategoriesSuccess,
  getCategoriesFailure,
  getClothSuccess,
  getClothFailure,
  getClothesSuccess,
  getClothesFailure,
} from '../actions/cloth'
import {
  getFiltersSuccess,
  getFiltersFailure,
} from '../actions/filters'

import { selectedFiltersSelector } from '../selectors/filters'

function* fetchSearch(action) {
  try {
    const { data } = yield call(axios.get, `/search?query=${encodeURIComponent(action.query)}`)
    yield put(searchSuccess(data))
  } catch (e) {
    yield put(searchFailure(e))
  }
}

function* getCategories() {
  try {
    const { data } = yield call(axios.get, '/products/statistics/categories')
    yield put(getCategoriesSuccess(data))
  } catch (e) {
    yield put(getCategoriesFailure(e))
  }
}

function* getCloth(clothtId) {
  try {
    yield put(setLoading(true))
    const { data } = yield call(axios.get, `/products/${clothtId}`)
    window.dataLayer.push({
      'event': 'productDetailsImpression',
      'ecommerce': {
        'currencyCode' : 'BRL',
        'detail': {
          'actionField': {'list': 'Cloth Details View'},
          'products': [{
            'name': data.productName,
            'id': data._id,
            'price': data.price,
            'brand': data.brand,
            'category': data.categories.join('/'),
           }]
         }
       }
    });
    yield put(getClothSuccess(data))
  } catch (e) {
    yield put(getClothFailure(e))
  } finally {
    yield put(setLoading(false))
  }
}

function* getClothes(action) {
  const { params: { currentPage, offset, query } } = action

  const selectedFilters = yield select(selectedFiltersSelector())
  const filters = objectToParams(selectedFilters)

  try {
    yield put(setLoading(true))
    const { data } = yield call(axios.get, `/products?currentPage=${currentPage + 1}&offset=${offset}${query}${filters}`)
    yield put(getClothesSuccess(data))
  } catch (e) {
    yield put(getClothesFailure(e))
  } finally {
    yield put(setLoading(false))
  }
}

function* getFilters(action) {
  const { params: { query } } = action

  const selectedFilters = yield select(selectedFiltersSelector())
  const filters = objectToParams(selectedFilters)

  try {
    const { data } = yield call(axios.get, `/products/statistics/filters?${query.substring(1)}${filters}`)
    yield put(getFiltersSuccess(data))
  } catch (e) {
    yield put(getFiltersFailure(e))
  }
}

/**
 * WATCHERS
 */

function* fetchSearchWatcher() {
  yield takeLatest('SEARCH_REQUEST', fetchSearch)
}

function* getCategoriesWatcher() {
  while (yield take('GET_CATEGORIES_REQUEST')) {
    yield call(getCategories) // waits for the getCategories task to terminate
  }
}

function* getClothWatcher() {
  while (true) {
    const { clothId } = yield take('GET_CLOTH_REQUEST')
    yield call(getCloth, clothId)
  }
}

function* getClothesWatcher() {
  yield takeLatest('GET_CLOTHES_REQUEST', getClothes)
}

function* getFiltersWatcher() {
  yield takeLatest('GET_FILTERS_REQUEST', getFilters)
}

export default function* root() {
  yield fork(fetchSearchWatcher)
  yield fork(getCategoriesWatcher)
  yield fork(getClothWatcher)
  yield fork(getClothesWatcher)
  yield fork(getFiltersWatcher)
}
