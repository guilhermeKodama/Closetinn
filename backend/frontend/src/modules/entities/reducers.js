import merge from 'lodash.merge'

import {
  INITIAL_STATE,
  MERGE_LOOKS,
  MERGE_PRODUCTS,
} from './constants'

export default (state = INITIAL_STATE, action) => {  
  switch (action.type) {
    case MERGE_LOOKS.ACTION:
    case MERGE_PRODUCTS.ACTION:
      return merge(state, action.payload)
    default:
      return state
  }
}
