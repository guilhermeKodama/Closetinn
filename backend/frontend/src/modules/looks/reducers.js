import {
  INITIAL_STATE,
  UPDATE_LOOK,
  GET_LOOK,
  GET_LOOKS,
  CREATE_LOOK,
  GET_RECOMMENDATION_LOOKS,
  LIKE_LOOK,
  DISLIKE_LOOK,
} from './constants'

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_LOOKS.SUCCESS:
      return {
        data: {
          ...state.data,
          ...action.payload,
        },
        error: null,
      }
    case GET_LOOKS.FAILED:
      return {
        data: {
          ...state.data,
        },
        error: action.message,
      }
    case CREATE_LOOK.SUCCESS:
      return { ...state, data: action.data }
    case UPDATE_LOOK.SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          look: action.data
        }
      }
    case GET_LOOK.SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        }
      }
    case GET_RECOMMENDATION_LOOKS.SUCCESS:
      return {
        data: {
          ...action.payload,
        },
        error: null,
      }
    case GET_RECOMMENDATION_LOOKS.FAILED:
      return {
        data: {
          ...state.data,
        },
        error: action.message,
      }
    case LIKE_LOOK.SUCCESS:
      return {
        data: {
          ...state.data,
        },
        error: null,
      }
    case DISLIKE_LOOK.SUCCESS:
      return {
        data: {
          ...state.data,
        },
        error: null,
      }
    default: return state
  }
}
