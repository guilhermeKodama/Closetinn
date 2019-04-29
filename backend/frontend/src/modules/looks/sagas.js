import { call, put, takeLatest, takeEvery, select, fork } from 'redux-saga/effects'
import { normalize } from 'normalizr'

import LookSchema from '../../schemas/look'

import { history } from '../../routers/AppRouter'

import axios from '../../utils/axios'

import {
  UPDATE_LOOK,
  GET_LOOK,
  GET_LOOKS,
  CREATE_LOOK,
  GET_RECOMMENDATION_LOOKS,
  LIKE_LOOK,
  DISLIKE_LOOK,
} from './constants'

import { MERGE_LOOKS } from '../entities/constants'

import { setLoading, setSnackbar } from '../app/actions'
import { userIdSelector } from '../user/selectors'

function* getLooks(action) {
  try {
    const { payload: { page, offset } } = action
    const { data: { looks, pagination } } = yield call(axios.get, `/looks?page=${page}&offset=${offset}`)
    const { entities, result } = normalize(looks, [LookSchema])
    yield put({ type: MERGE_LOOKS.ACTION, payload: entities })
    yield put({ type: GET_LOOKS.SUCCESS, payload: { looks: result, pagination } })
  } catch (e) {
    yield put(setSnackbar({ open: true, variant: 'error', message: 'Ocorreu um erro no servidor!' }))
    yield put({ type: GET_LOOKS.FAILED, message: e.message || e })
  }
}

function* createLook(action) {
  try {
    const { payload } = action
    const products = JSON.parse(payload.get('products'))

    if(products && products.length > 0) {
      const { data } = yield call(axios.post, '/looks', action.payload)
      yield put(setSnackbar({ open: true, variant: 'success', message: 'Look cadastrado!' }))
      yield put({ type: CREATE_LOOK.SUCCESS, data })
    } else {
      yield put(setSnackbar({ open: true, variant: 'error', message: 'Os produtos não podem estar vazios!' }))
    }
  } catch (e) {
    yield put(setSnackbar({ open: true, variant: 'error', message: 'Ocorreu um erro no servidor!' }))
    yield put({ type: CREATE_LOOK.FAILED, message: e.message || e })
  }
}


function* updateLook(action) {
  try {
    const { payload } = action
    const products = JSON.parse(payload.data.get('products'))

    if(products && products.length > 0) {
      const { data } = yield call(axios.put, `/looks/${payload.lookId}`, payload.data)
      yield put(setSnackbar({ open: true, variant: 'success', message: 'Look cadastrado!' }))
      yield put({ type: UPDATE_LOOK.SUCCESS, data })
    } else {
      yield put(setSnackbar({ open: true, variant: 'error', message: 'Os produtos não podem estar vazios!' }))
    }
  } catch (e) {
    yield put(setSnackbar({ open: true, variant: 'error', message: 'Ocorreu um erro no servidor!' }))
    yield put({ type: UPDATE_LOOK.FAILED, message: e.message || e })
  }
}

function* getLook(action) {
  try {
    const { payload: { lookId } } = action
    const { data } = yield call(axios.get, `/looks/${lookId}`)
    const { entities, result } = normalize(data, LookSchema)
    yield put({ type: MERGE_LOOKS.ACTION, payload: entities })
    yield put({ type: GET_LOOK.SUCCESS, payload: { look: result } })
  } catch (e) {
    yield put(setSnackbar({ open: true, variant: 'error', message: 'Ocorreu um erro no servidor!' }))
    yield put({ type: GET_LOOK.FAILED, message: e.message || e })
  }
}

function* getRecommendationLooks(action) {
  try {
    yield put(setLoading(true))
    const { payload: { recommendationId } } = action
    const userId = yield select(userIdSelector())
    const { data: { looks, pagination } } = yield call(axios.get, `/users/${userId}/recommendations/looks/${recommendationId}`, action.payload)
    const { entities, result } = normalize(looks, [LookSchema])
    yield put({ type: MERGE_LOOKS.ACTION, payload: entities })
    yield put({ type: GET_RECOMMENDATION_LOOKS.SUCCESS, payload: { looks: result, pagination } })
  } catch (e) {
    yield put(setSnackbar({ open: true, variant: 'error', message: 'Recomendações de looks não encontradas' }))
    yield put({ type: GET_RECOMMENDATION_LOOKS.FAILED, message: e.message || e })
    yield call(history.push, '/NotFound')
  } finally {
    yield put(setLoading(false))
  }
}

function* likeLook(action) {
  try {
    const { payload: { lookId } } = action
    const userId = yield select(userIdSelector())
    let { data } = yield call(axios.post, `/users/${userId}/looks/${lookId}/like`)
    data._id = lookId
    const { entities } = normalize(data, LookSchema)
    yield put({ type: MERGE_LOOKS.ACTION, payload: entities })
    yield put({ type: LIKE_LOOK.SUCCESS })
  } catch (e) {
    yield put(setSnackbar({ open: true, variant: 'error', message: 'Ocorreu um erro no servidor!' }))
    yield put({ type: LIKE_LOOK.FAILED, message: e.message || e })
  }
}

function* dislikeLook(action) {
  try {
    const { payload: { lookId } } = action
    const userId = yield select(userIdSelector())
    const { data } = yield call(axios.post, `/users/${userId}/looks/${lookId}/dislike`)
    data._id = lookId
    const { entities } = normalize(data, LookSchema)
    yield put({ type: MERGE_LOOKS.ACTION, payload: entities })
    yield put({ type: DISLIKE_LOOK.SUCCESS })
  } catch (e) {
    yield put(setSnackbar({ open: true, variant: 'error', message: 'Ocorreu um erro no servidor!' }))
    yield put({ type: DISLIKE_LOOK.FAILED, message: e.message || e })
  }
}

function* getLooksWatcher() {
  yield takeLatest(GET_LOOKS.ACTION, getLooks)
}

function* createLookWatcher() {
  yield takeLatest(CREATE_LOOK.ACTION, createLook)
}

function* updateLookWatcher() {
  yield takeLatest(UPDATE_LOOK.ACTION, updateLook)
}

function* getLookWatcher() {
  yield takeLatest(GET_LOOK.ACTION, getLook)
}

function* getRecommendationLooksWatcher() {
  yield takeEvery(GET_RECOMMENDATION_LOOKS.ACTION, getRecommendationLooks)
}

function* likeLookWatcher() {
  yield takeLatest(LIKE_LOOK.ACTION, likeLook)
}

function* dislikeLookWatcher() {
  yield takeLatest(DISLIKE_LOOK.ACTION, dislikeLook)
}



export default function* root() {
  yield fork(getLooksWatcher)
  yield fork(createLookWatcher)
  yield fork(updateLookWatcher)
  yield fork(getLookWatcher)
  yield fork(getRecommendationLooksWatcher)
  yield fork(likeLookWatcher)
  yield fork(dislikeLookWatcher)
}
