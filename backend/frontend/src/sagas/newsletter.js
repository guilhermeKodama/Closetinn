import { call, put, takeLatest, select, fork } from 'redux-saga/effects'
import { isValid, reset } from 'redux-form'

import axios from '../utils/axios'

import { setSnackbar } from '../actions/app'
import {
  subscribeNewsletterSuccess,
  subscribeNewsletterFailure,
  unsubscribeNewsletterSuccess,
  unsubscribeNewsletterFailure,
} from '../actions/newsletter'

import { emailFormSelector } from '../selectors/newsletter'

function* subscribeNewsletter(action) {
  const valid = yield select(isValid('NewsletterForm'))

  if (!valid) return

  const email = yield select(emailFormSelector())
  const payload = { email }

  try {
    const { data } = yield call(axios.post, '/newsletters', payload)
    yield put(subscribeNewsletterSuccess(data))
    yield put(setSnackbar({ openSnackbar: true, variant: 'success', messageSnackbar: 'E-mail cadastrado' }))
  } catch (e) {
    yield put(subscribeNewsletterFailure(e))
    yield put(setSnackbar({ openSnackbar: true, variant: 'error', messageSnackbar: 'E-mail já está cadastrado' }))
  } finally {
    yield put(reset('NewsletterForm'))
  }
}

function* unsubscribeNewsletter(action) {
  const newsletterId = action.newsletterId

  try {
    const { data } = yield call(axios.delete, `/newsletters/${newsletterId}`)
    yield put(unsubscribeNewsletterSuccess(data))
  } catch (e) {
    yield put(unsubscribeNewsletterFailure(e))
  }
}

/**
 * WATCHERS
 */

function* subscribeNewsletterWatcher() {
  yield takeLatest('SUBSCRIBE_NEWSLETTER_REQUEST', subscribeNewsletter)
}

function* unsubscribeNewslleterWatcher() {
  yield takeLatest('UNSUBSCRIBE_NEWSLETTER_REQUEST', unsubscribeNewsletter)
}

export default function* root() {
  yield fork(subscribeNewsletterWatcher)
  yield fork(unsubscribeNewslleterWatcher)
}
