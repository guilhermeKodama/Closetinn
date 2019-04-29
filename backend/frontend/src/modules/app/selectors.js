import { createSelector } from 'reselect'

export const appSelector = () => state => state.app.data

export const loadingSelector = () => createSelector(
  appSelector(),
  ({ loading }) => loading,
)

export const openDrawerSelector = () => createSelector(
  appSelector(),
  ({ openDrawer }) => openDrawer,
)

export const openCartSelector = () => createSelector(
  appSelector(),
  ({ openCart }) => openCart,
)

export const openFilterSelector = () => createSelector(
  appSelector(),
  ({ openFilter }) => openFilter,
)

export const openSnackbarSelector = () => createSelector(
  appSelector(),
  ({ snackbar: { open } }) => open,
)

export const messageSnackbarSelector = () => createSelector(
  appSelector(),
  ({ snackbar: { message } }) => message,
)

export const variantSnackbarSelector = () => createSelector(
  appSelector(),
  ({ snackbar: { variant } }) => variant,
)
