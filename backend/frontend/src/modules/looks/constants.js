import { createSagaAction } from '../../utils/sagas'

export const INITIAL_STATE = {
  data: {
    looks: [],
    look: null,
    pagination: {
      totalPages: 0,
      totalItems: 0,
    },
  },
  error: null
}

export const LOOKS_STATE_KEY = 'looks'

export const UPDATE_LOOK = createSagaAction('UPDATE_LOOK')

export const GET_LOOKS = createSagaAction('GET_LOOKS')

export const GET_LOOK = createSagaAction('GET_LOOK')

export const CREATE_LOOK = createSagaAction('CREATE_LOOK')

export const GET_RECOMMENDATION_LOOKS = createSagaAction('GET_RECOMMENDATION_LOOKS')

export const LIKE_LOOK = createSagaAction('LIKE_LOOK')

export const DISLIKE_LOOK = createSagaAction('DISLIKE_LOOK')
