import { createSagaAction } from '../../utils/sagas'

export const INITIAL_STATE = {
  data: {
    products: [],
    pagination: {
      totalPages: 0,
      totalItems: 0,
    },
  },
  error: null,
}

export const GET_RECOMMENDATION_PROMOTIONS = createSagaAction('GET_RECOMMENDATION_PROMOTIONS')
