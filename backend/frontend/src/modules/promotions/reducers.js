import {
  INITIAL_STATE,
  GET_RECOMMENDATION_PROMOTIONS,
} from './constants'

const promotions = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case GET_RECOMMENDATION_PROMOTIONS.SUCCESS:
      return {
        data: {
          ...state.data,
          ...action.payload,
        },
        error: null,
      }
    case GET_RECOMMENDATION_PROMOTIONS.FAILED:
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }
    default:
      return state
  }
}

export default promotions
