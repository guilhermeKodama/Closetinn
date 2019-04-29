const INITIAL_STATE = {
  loading: false,
  closet: {
    favoritedProduct: null,
    isFavoriteModalOpen: false,
    isCreateFolderModalOpen: false,
    isRemoveFolderModalOpen: false,
    isEditFolderModalOpen: false,
    selectedFolder: null,
  },
  openDrawer: false,
  openFilter: false,
  openCart: false,
  openSnackbar: false,
  variantSnackbar: '',
  messageSnackbar: '',
}

const app = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'DRAWER_TOGGLE':
      return {
        ...state,
        openDrawer: !state.openDrawer,
      }
    case 'FILTER_TOGGLE':
      return {
        ...state,
        openFilter: !state.openFilter,
      }
    case 'CART_TOGGLE':
      return {
        ...state,
        openCart: !state.openCart,
      }
    case 'FAVORITE_MODAL_OPEN':
      return {
        ...state,
        closet: {
          ...state.closet,
          isFavoriteModalOpen: true,
          favoritedProduct: action.product
        }
      }
    case 'FAVORITE_MODAL_CLOSE':
      return {
        ...state,
        closet: {
          ...state.closet,
          isFavoriteModalOpen: false,
          favoritedProduct: null
        }
      }
    case 'REMOVE_FOLDER_MODAL_OPEN':
      return {
        ...state,
        closet: {
          ...state.closet,
          isRemoveFolderModalOpen: true,
          selectedFolder: action.folder
        }
      }
    case 'REMOVE_FOLDER_MODAL_CLOSE':
      return {
        ...state,
        closet: {
          ...state.closet,
          isRemoveFolderModalOpen: false,
          selectedFolder: null
        }
      }
    case 'EDIT_FOLDER_MODAL_OPEN':
      return {
        ...state,
        closet: {
          ...state.closet,
          isCreateFolderModalOpen: true,
          selectedFolder: action.folder
        }
      }
    case 'EDIT_FOLDER_MODAL_CLOSE':
      return {
        ...state,
        closet: {
          ...state.closet,
          isCreateFolderModalOpen: false,
          selectedFolder: null
        }
      }
    case 'CREATE_FOLDER_MODAL_OPEN':
      return {
        ...state,
        closet: {
          ...state.closet,
          isCreateFolderModalOpen: true,
          selectedFolder: null
        }
      }
    case 'CREATE_FOLDER_MODAL_CLOSE':
      return {
        ...state,
        closet: {
          ...state.closet,
          isCreateFolderModalOpen: false,
          selectedFolder: null
        }
      }
    case 'SET_SNACKBAR':
      return {
        ...state,
        ...action.payload,
      }
    case 'REQUEST_AUTH':
    case 'FETCH_PRODUCTS_REQUEST':
    case 'REQUEST_RECOMMENDATION_BASED_ON_DESCRIPTION':
      return {
        ...state,
        errorMessage: null
      }
    case 'REQUEST_AUTH_SUCCESS':
    case 'FETCH_PRODUCTS_SUCCESS':
    case 'RECEIVE_RECOMMENDATION_BASED_ON_DESCRIPTION':
      return {
        ...state,
        errorMessage: null
      }
    case 'REQUEST_AUTH_FAILURE':
    case 'FETCH_PRODUCTS_FAILURE':
    case 'REQUEST_RECOMMENDATION_BASED_ON_DESCRIPTION_FAILED':
      return {
        ...state,
        errorMessage: action.error
      }
    default:
      return state
  }
}

export default app
