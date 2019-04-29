import {
  INITIAL_STATE,
  SET_LOADING,
  SET_SNACKBAR,
} from './constants'

const app = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case SET_LOADING.ACTION:
      return {
        data: {
          ...state.data,
          loading: action.loading,
        },
        error: null,
      }
    case SET_SNACKBAR.ACTION:
      return {
        data: {
          ...state.data,
          snackbar: {
            ...action.payload,
          }
        },
        error: null,
      }
    default:
      return state
  }
}

export default app
