import axios from '../utils/axios'

/**
 * GET CLOSET
 */

const getClosetRequest = () => {
  return {
   type: 'GET_CLOSET_REQUEST'
  }
}

const getClosetSuccess = json => {
  return {
   type: 'GET_CLOSET_SUCCESS',
   closet: json.closet
  }
}

const getClosetFailure = error => {
  return {
   type: 'GET_CLOSET_FAILURE',
   error: error.message
  }
}

export const getCloset = () => (
  (dispatch, getState) => {
    dispatch(getClosetRequest())

    const { _id: userId } = getState().user.data

    return axios(`/users/${userId}/closet`)
    .then(response => {
      return dispatch(getClosetSuccess(response.data))
     }).catch(error => {
       return dispatch(getClosetFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * GET CLOSET CLOTHES
 */

const getClosetClothesRequest = () => {
  return {
   type: 'GET_CLOSET_CLOTHES_REQUEST'
  }
}

const getClosetClothesSuccess = clothes => {
  return {
   type: 'GET_CLOSET_CLOTHES_SUCCESS',
   clothes
  }
}

const getClosetClothesFailure = error => {
  return {
   type: 'GET_CLOSET_CLOTHES_FAILURE',
   error: error.message
  }
}

export const getClosetClothes = folderId => (
  (dispatch, getState) => {
    dispatch(getClosetClothesRequest())

    const { _id: userId } = getState().user.data

    return axios(`/users/${userId}/closet/${folderId}`)
    .then(response => {
      const data = response.data
      return dispatch(getClosetClothesSuccess(data.folderId, data.clothes))
     }).catch(error => {
       return dispatch(getClosetClothesFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * CREATE FOLDER
 */

const createFolderRequest = () => ({
  type: 'CLOSET_CREATE_FOLDER_REQUEST'
})

const createFolderSuccess = json => ({
  type: 'CLOSET_CREATE_FOLDER_SUCCESS',
  closet: json.closet
})

const createFolderFailure = error => ({
  type: 'CLOSET_CREATE_FOLDER_FAILURE',
  error: error.message
})

export const closetCreateFolder = (folderName, description = '', productId) => (
  (dispatch, getState) => {
    dispatch(createFolderRequest())

    const { _id: userId } = getState().user.data

    return axios(`/users/${userId}/closet/folders`,
    {
      method: 'post',
      data: JSON.stringify({ folderName, description, productId })
     }).then(response => {
       return dispatch(createFolderSuccess(response.data))
     }).catch(error => {
       return dispatch(createFolderFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * UPDATE FOLDER
 */

const editFolderRequest = () => ({
  type: 'CLOSET_EDIT_FOLDER_REQUEST'
})

const editFolderSuccess = json => ({
  type: 'CLOSET_EDIT_FOLDER_SUCCESS',
  closet: json.closet
})

const editFolderFailure = error => ({
  type: 'CLOSET_EDIT_FOLDER_FAILURE',
  error: error.message
})

export const closetEditFolder = (folderId, folderName, description = '') => (
  (dispatch, getState) => {
    dispatch(editFolderRequest())

    const { _id: userId } = getState().user.data

    return axios(`/users/${userId}/closet/folders/${folderId}`,
    {
        method: 'put',
        data: JSON.stringify({ folderName, description })
     }).then(response => {
       return dispatch(editFolderSuccess(response.data))
     }).catch(error => {
       dispatch(editFolderFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * REMOVE FOLDER
 */

const removeFolderRequest = () => ({
  type: 'CLOSET_REMOVE_FOLDER_REQUEST'
})

const removeFolderSuccess = json => ({
  type: 'CLOSET_REMOVE_FOLDER_SUCCESS',
  closet: json.closet
})

const removeFolderFailure = error => ({
  type: 'CLOSET_REMOVE_FOLDER_FAILURE',
  error: error.message
})

export const closetRemoveFolder = folderId => (
  (dispatch, getState) => {
    dispatch(removeFolderRequest())

    const { _id: userId } = getState().user.data

    return axios(`/users/${userId}/closet/folders/${folderId}`,
    {
        method: 'delete'
     }).then(response => {
       return dispatch(removeFolderSuccess(response.data))
     }).catch(error => {
       dispatch(removeFolderFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * ADD PRODUCT TO CLOSET FOLDER
 */

const addProductToClosetFolderRequest = () => ({
  type: 'ADD_PRODUCT_TO_CLOSET_FOLDER_REQUEST'
})

const addProductToClosetFolderSuccess = json => ({
  type: 'ADD_PRODUCT_TO_CLOSET_FOLDER_SUCCESS',
  closet: json.closet
})

const addProductToClosetFolderFailure = error => ({
  type: 'ADD_PRODUCT_TO_CLOSET_FOLDER_FAILURE',
  error: error.message
})

export const addProductToClosetFolder = (folderId, productId) => (
  (dispatch, getState) => {
    dispatch(addProductToClosetFolderRequest())

    const { _id: userId } = getState().user.data

    return axios(`/users/${userId}/closet/folders/${folderId}/products`,
    {
        method: 'post',
        data: JSON.stringify({ productId })
     })
     .then(response => {
       return dispatch(addProductToClosetFolderSuccess(response.data))
     }).catch(error => {
       return dispatch(addProductToClosetFolderFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * REMOVE PRODUCT FROM CLOSET FOLDER
 */

const removeProductFromClosetFolderRequest = () => ({
  type: 'REMOVE_PRODUCT_FROM_CLOSET_FOLDER_REQUEST'
})

const removeProductFromClosetFolderSuccess = json => ({
  type: 'REMOVE_PRODUCT_FROM_CLOSET_FOLDER_SUCCESS',
  closet: json.closet
})

const removeProductFromClosetFolderFailure = error => ({
  type: 'REMOVE_PRODUCT_FROM_CLOSET_FOLDER_FAILURE',
  error: error.message
})

export const removeProductFromClosetFolder = (folderId, productId) => (
  (dispatch, getState) => {
    dispatch(removeProductFromClosetFolderRequest())

    const { _id: userId } = getState().user.data

    return axios(`/users/${userId}/closet/folders/${folderId}/products/${productId}`,
    { method: 'delete' })
    .then(response => {
      return dispatch(removeProductFromClosetFolderSuccess(response.data))
     }).catch(error => {
       dispatch(removeProductFromClosetFolderFailure(error))
     })
  }
)
