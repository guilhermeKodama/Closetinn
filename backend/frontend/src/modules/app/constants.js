import { createSagaAction } from '../../utils/sagas'

export const INITIAL_STATE = {
  data: {
    loading: false,
    snackbar: {
      open: false,
      variant: '',
      message: '',
    },
  },
  error: null,
}

export const SET_LOADING = createSagaAction('SET_LOADING')
export const SET_SNACKBAR = createSagaAction('SET_SNACKBAR')
