import {
  SET_LOADING,
  SET_SNACKBAR,
} from './constants'

export const setLoading = loading => ({
  type: SET_LOADING.ACTION,
  loading,
})

export const setSnackbar = payload => ({
  type: SET_SNACKBAR.ACTION,
  payload,
})
