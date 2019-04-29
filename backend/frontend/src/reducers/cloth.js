import { loadState } from '../localStorage'

const INITIAL_STATE = {
  data: {
    categories: loadState('categories') || {},
    clothDetail: {
      images_urls: [],
      descriptionBasedRecommendations: [],
      sizes: [],
    },
    products: [],
    pagination: {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0
    },
  },
  error: null,
}

const products = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case 'GET_CLOTHES_SUCCESS':
      return {
        data: {
          ...state.data,
          ...action.payload,
        },
        error: null,
      }
    case 'GET_CLOTHES_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }
    case 'RECOMMENDATION_BASED_ON_DESCRIPTION_SUCCESS':
      return {
        data: {
          ...state.data,
          clothDetail: {
            ...state.data.clothDetail,
            descriptionBasedRecommendations: action.products || []
          }
        },
        error: null,
      }
    case 'RECOMMENDATION_BASED_ON_DESCRIPTION_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error
      }
    case 'GET_CLOTH_SUCCESS':
      return {
        data: {
          ...state.data,
          clothDetail: {
            ...action.payload,
            descriptionBasedRecommendations: state.data.clothDetail.descriptionBasedRecommendations
          }
        },
        error: null,
      }
    case 'GET_CLOTH_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error
      }
    case 'GET_CATEGORIES_SUCCESS':
      return {
        data: {
          ...state.data,
          ...action.payload
        },
        error: null,
      }
    case 'GET_CATEGORIES_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error
      }
    default:
      return state
  }
}

export default products
