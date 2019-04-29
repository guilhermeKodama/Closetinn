import { createSagaAction } from '../../utils/sagas'

import { LOOKS_STATE_KEY } from '../looks/constants'
import { PRODUCTS_STATE_KEY } from '../products/constants'

export const INITIAL_STATE = {
  [LOOKS_STATE_KEY]: {},
  [PRODUCTS_STATE_KEY]: {},
}

export const MERGE_LOOKS = createSagaAction('MERGE_LOOKS')

export const MERGE_PRODUCTS = createSagaAction('MERGE_PRODUCTS')
