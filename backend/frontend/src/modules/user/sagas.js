import { call, put, takeLatest, takeEvery, select, fork } from 'redux-saga/effects'
import { isValid } from 'redux-form'

import { history } from '../../routers/AppRouter'

import axios from '../../utils/axios'

import { setLoading, setSnackbar } from '../app/actions'

import {
  SET_TOKEN,
  GET_ME,
  UNSUBSCRIBE,
  UPDATE_USER
} from './constants'
import {
  clearUserError,
  signInSuccess,
  signInFailure,
  signInFacebookSuccess,
  signInFacebookFailure,
} from './actions'
import {
  userSelector,
  emailFormSelector,
  passwordSelector,
  anonymousIdSelector,
} from './selectors'

import { click, EVENT } from '../../utils/atena/'

function* signIn() {
  yield put(clearUserError())
  const valid = yield select(isValid('SignInForm'))

  if (!valid) return

  // TODO wtf????
  const email = yield select(emailFormSelector())
  const password = yield select(passwordSelector())
  const anonymousId = yield select(anonymousIdSelector())

  const payload = { email, password, anonymousId }

  try {
    yield put(setLoading(true))
    const { data } = yield call(axios.post, '/auth', payload)
    yield put(signInSuccess(data))
    yield call(history.push, '/profile')
  } catch (e) {
    const { status } = e.response
    let error = ''

    if (status === 401 || status === 404) {
      error = 'E-mail ou senha incorretos'
    } else {
      error = 'Alguma coisa deu errado'
    }
    yield put(signInFailure(error))
  } finally {
    yield put(setLoading(false))
  }
}

function* signInFacebook(action) {
  yield put(clearUserError())
  const { response } = action
  const anonymousId = yield select(anonymousIdSelector())
  const payload = { ...response, anonymousId }

  try {
    yield put(setLoading(true))
    const { data } = yield call(axios.post, '/auth/facebook', payload)
    yield put(signInFacebookSuccess(data))
    yield call(history.push, '/profile')
  } catch (e) {
    yield put(signInFacebookFailure(e))
  } finally {
    yield put(setLoading(false))
  }
}

function* getMe(action) {
  try {
    const { payload: { token, nextRoute }} = action
    if (token) yield put({ type: SET_TOKEN.SUCCESS, payload: { token } })
    const { data } = yield call(axios.get, '/users/me')
    yield put({ type: GET_ME.SUCCESS, payload: { ...data } })

    if (nextRoute) {
      yield call(history.push, nextRoute)

      const path = nextRoute.split('/')[1]

      switch (path) {
        case 'looks':
          click(data._id, null, null, EVENT.EMAIL_LOOK_RECOMMENDATION_CLICK, nextRoute)
          break
        case 'promotions':
          click(data._id, null, null, EVENT.EMAIL_PROMOTION_RECOMMENDATION_CLICK, nextRoute)
          break
        case 'unsubscribe':
          click(data._id, null, null, EVENT.EMAIL_UNSUBSCRIBE_CLICK, nextRoute)
          break
        default: break
      }
    }
  } catch (e) {
    yield put({ type: GET_ME.FAILED, message: e.message || e })
  }
}

function* unsubscribe(action) {
  try {
    const { payload } = action
    const { data } = yield call(axios.put, '/users/unsubscribe', payload)
    yield put({ type: UNSUBSCRIBE.SUCCESS, payload: { data } })
    yield put(setSnackbar({ open: true, variant: 'success', message: 'Newsletter removida com sucesso!' }))
  } catch (e) {
    yield put(setSnackbar({ open: true, variant: 'error', message: 'Ocorreu um erro no servidor. Por favor tente mais tarde.' }))
    yield put({ type: UNSUBSCRIBE.FAILED, message: e.message || e })
  }
}

function* updateUser(action) {
  try {
    const { payload } = action
    const user = yield select(userSelector())
    const { data } = yield call(axios.put, `/users/${user._id}`, payload)
    yield put({ type: UPDATE_USER.SUCCESS, payload: { data } })
    yield put(setSnackbar({ open: true, variant: 'success', message: 'Informações atualizadas com sucesso!' }))
  } catch (e) {
    yield put(setSnackbar({ open: true, variant: 'error', message: 'Ocorreu um erro no servidor. Por favor tente mais tarde.' }))
    yield put({ type: UPDATE_USER.FAILED, message: e.message || e })
  }
}

/* WATCHERS */

function* signInWatcher() {
  yield takeLatest('SIGN_IN_REQUEST', signIn)
}

function* signInFacebookWatcher() {
  yield takeLatest('SIGN_IN_FACEBOOK_REQUEST', signInFacebook)
}

function* getMeWatcher() {
  yield takeEvery(GET_ME.ACTION, getMe)
}

function* unsubscribeWatcher() {
  yield takeEvery(UNSUBSCRIBE.ACTION, unsubscribe)
}

function* updateUserWatcher() {
  yield takeEvery(UPDATE_USER.ACTION, updateUser)
}

export default function* root() {
  yield fork(getMeWatcher)
  yield fork(signInWatcher)
  yield fork(signInFacebookWatcher)
  yield fork(unsubscribeWatcher)
  yield fork(updateUserWatcher)
}
