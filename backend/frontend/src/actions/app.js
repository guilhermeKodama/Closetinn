/**
 * GET CLOSET
 */

 export const setLoading = loading => ({
   type: 'SET_LOADING',
   loading,
 })

export const drawerToggle = () => ({
  type: 'DRAWER_TOGGLE',
})

export const filterToggle = () => ({
  type: 'FILTER_TOGGLE',
})

export const cartToggle = () => ({
  type: 'CART_TOGGLE',
})

export const favoriteModalOpen = product => ({
  type: 'FAVORITE_MODAL_OPEN',
  product
})

export const favoriteModalClose = () => ({
  type: 'FAVORITE_MODAL_CLOSE'
})

export const removeFolderModalOpen = folder => ({
  type: 'REMOVE_FOLDER_MODAL_OPEN',
  folder
})

export const removeFolderModalClose = () => ({
  type: 'REMOVE_FOLDER_MODAL_CLOSE'
})

export const editFolderModalClose = () => ({
  type: 'EDIT_FOLDER_MODAL_CLOSE'
})

export const editFolderModalOpen = folder => ({
  type: 'EDIT_FOLDER_MODAL_OPEN',
  folder
})

export const createFolderModalOpen = () => ({
  type: 'CREATE_FOLDER_MODAL_OPEN'
})

export const createFolderModalClose = () => ({
  type: 'CREATE_FOLDER_MODAL_CLOSE'
})

export const setSnackbar = payload => ({
  type: 'SET_SNACKBAR',
  payload,
})
