import { createSagaAction } from '../../utils/sagas'

export const INITIAL_STATE = {
  data: {},
  error: null
}

export const PRODUCTS_STATE_KEY = 'products'

export const UPDATE_LOOK = createSagaAction('UPDATE_LOOK')

export const LIKE_PRODUCT = createSagaAction('LIKE_PRODUCT')

export const DISLIKE_PRODUCT = createSagaAction('DISLIKE_PRODUCT')