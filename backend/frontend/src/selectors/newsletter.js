import { createSelector } from 'reselect'
import { getFormValues } from 'redux-form'

const newsletterFormValueSelector = () => getFormValues('NewsletterForm')

export const emailFormSelector = () => createSelector(
  newsletterFormValueSelector(),
  values => values && values.email,
)
