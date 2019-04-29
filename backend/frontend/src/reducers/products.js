// a reducer takes in two things:
// 1. the action (info about what happened)
// 2. copy of current state

function products(state = [], action) {
  let newState
  switch(action.type) {
    case 'FETCH_PRODUCTS_SUCCESS':
      newState = Object.assign([], state)
      newState = newState.concat(action.products)
      return newState
    case 'RECEIVE_RECOMMENDATION_BASED_ON_DESCRIPTION':
      const newProduct = Object.assign({}, state[action.productIndex])
      newProduct.descriptionBasedRecommendations = action.products

      newState = Object.assign([], state)
      newState[action.productIndex] = newProduct

      return newState
    default:
      return state
  }
}

export default products 
