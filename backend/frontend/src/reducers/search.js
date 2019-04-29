const INITIAL_STATE = {
  products: []
}

const search = (state = INITIAL_STATE, action) => {
  switch(action.type){
    case 'SEARCH_SUCCESS':
      return {
        products: action.products || []
      }
    case 'SEARCH_FAILURE':
      return {
        products: [],
        error: action.error
      }
    case 'SEARCH_CLEAR':
      return INITIAL_STATE
    default:
      return state
  }
}

export default search
