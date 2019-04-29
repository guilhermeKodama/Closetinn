import { constants } from './actions'
import { createReducer } from '../../utils/reducers'

const initialState = {}

export default createReducer(initialState, (state, action) => {
  switch (action.type) {
    case constants.SEARCH.SUCCESS:
      return { ...state, data: action.data }
    case constants.CLEAN_SEARCH.ACTION:
      return { ...state, data: { productsSearch: null } }
    default:
      return state
  }
})
