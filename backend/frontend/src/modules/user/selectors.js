import { createSelector } from 'reselect'
import { getFormValues } from 'redux-form'

export const userSelector = () => state => state.user.data
export const userErrorSelector = () => state => state.user.error

const signInFormValueSelector = () => getFormValues('SignInForm')

export const emailFormSelector = () => createSelector(
  signInFormValueSelector(),
  values => values && values.email,
)

export const passwordSelector = () => createSelector(
  signInFormValueSelector(),
  values => values && values.password,
)

export const userIdSelector = () => createSelector(
  userSelector(),
  ({ _id }) => _id,
)

export const nameSelector = () => createSelector(
  userSelector(),
  ({ name }) => name,
)

export const loggedSelector = () => createSelector(
  userSelector(),
  ({ logged }) => logged,
)

export const closetSelector = () => createSelector(
  userSelector(),
  ({ closet }) => closet,
)

export const cartProductsSelector = () => createSelector(
  userSelector(),
  ({ cart: { products } }) => products,
)

export const anonymousIdSelector = () => createSelector(
  userSelector(),
  ({ anonymousId }) => anonymousId,
)
