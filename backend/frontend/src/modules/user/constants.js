import { createSagaAction } from '../../utils/sagas'

export const SET_TOKEN = createSagaAction('SET_TOKEN')
export const GET_ME = createSagaAction('GET_ME')
export const UNSUBSCRIBE = createSagaAction('UNSUBSCRIBE')
export const UPDATE_USER = createSagaAction('UPDATE_USER')
