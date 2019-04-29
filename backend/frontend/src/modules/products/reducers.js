import {
  INITIAL_STATE,
  LIKE_PRODUCT,
  DISLIKE_PRODUCT,
} from './constants'

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LIKE_PRODUCT.SUCCESS:
      return {
        data: {
          ...state.data,
        },
        error: null,
      }
    case DISLIKE_PRODUCT.SUCCESS:
      return {
        data: {
          ...state.data,
        },
        error: null,
      }
    default: return state
  }
}
