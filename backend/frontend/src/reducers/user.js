// a reducer takes in two things:
// 1. the action (info about what happened)
// 2. copy of current state

function user(state = [], action) {
  switch(action.type) {
    case 'LOGOUT':
      return {
          isLoggedIn: false,
          error: null
      }
    case 'RECEIVE_LOGIN':
        return {
          ...state,
          id: action.id,
          name: action.name,
          email: action.email,
          token: action.token,
          wishlist: action.wishlist,
          isLoggedIn: true
        }
    case 'REQUEST_LOGIN_FAILED':
      return {
        ...state,
        error: action.error,
        isLoggedIn: false
      }
    case 'RECEIVE_SIGNUP':
        return {
          ...state,
          id: action.id,
          name: action.name,
          email: action.email,
          token: action.token,
          wishlist: action.wishlist,
          isLoggedIn: true
        }
    case 'REQUEST_SIGNUP_FAILED':
      return {
        ...state,
        error: action.error,
        isLoggedIn: false
      }
    case 'RECEIVE_USER_UPDATE':
        return {
          ...state,
          name: action.name,
          email: action.email
        }
    case 'REQUEST_USER_UPDATE_FAILED':
      return {
        ...state,
        error: action.error
      }
    case 'RECEIVE_ADD_PRODUCT_TO_WISHLIST':
      return {
        ...state,
        wishlist: action.wishlist
      }
    case 'REQUEST_ADD_PRODUCT_TO_WISHLIST_FAILED':
      return {
        ...state,
        error: action.error
      }
    case 'RECEIVE_REMOVE_PRODUCT_FROM_WISHLIST':
      return {
        ...state,
        wishlist: action.wishlist
      }
    case 'REQUEST_REMOVE_PRODUCT_FROM_WISHLIST_FAILED':
      return {
        ...state,
        error: action.error
      }
    case 'REQUEST_AUTH_SUCCESS':
        return {
          ...state,
          token: action.token
        }
    case 'REQUEST_AUTH_FAILURE':
      return {
        ...state,
        error: action.error,
      }
    default:
      return state
  }
}

export default user
