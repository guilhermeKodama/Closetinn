import axios from '../../utils/axios'
import { constants } from './actions'
import { call, put, takeLatest, fork } from 'redux-saga/effects'

function* fetchSearch(action) {
  try {
    let uri = `/search?query=${encodeURIComponent(action.query)}`
    if (action.offset) uri = uri + `&offset=${action.offset}`
    if (action.currentPage) uri = uri + `&currentPage=${action.currentPage}`

    const { data } = yield call(axios.get, uri)
    yield put({ type: constants.SEARCH.SUCCESS, data })
  } catch (e) {
    yield put({ type: constants.SEARCH.FAILED, message: e.message || e })
  }
}

function* fetchSearchWatcher() {
  yield takeLatest(constants.SEARCH.ACTION, fetchSearch)
}

export default function* root() {
  yield fork(fetchSearchWatcher)
}
