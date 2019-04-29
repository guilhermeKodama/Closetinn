import { all, fork } from 'redux-saga/effects'

import cloth from './cloth'
import newsletter from './newsletter'

export default function* root() {
  yield all([
    fork(cloth),
    fork(newsletter),
  ])
}
