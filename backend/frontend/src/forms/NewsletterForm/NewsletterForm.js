import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import Send from '@material-ui/icons/Send'

import { isValidEmail } from '../../utils/common'
import { renderTextField } from '../../utils/form'

const validate = values => {
  const errors = {}

  if (values.email && !isValidEmail(values.email)) {
    errors.email = 'E-mail inválido'
  }

  return errors
}

let NewsletterForm = ({
  classes,
  onSubmit,
  submitting,
}) => (
  <form
    className={classes.root}
    onSubmit={onSubmit}
    method='post'
  >
    <Field
      classes={{ root: classes.input }}
      type='email'
      name='email'
      component={renderTextField}
      label='Digite o seu e-mail'
      fullWidth
    />
    <Button
      className={classes.button}
      variant='contained'
      color='inherit'
      type='submit'
      disabled={submitting}
    >
      <Send className={classes.leftIcon}/>
      Enviar
    </Button>
  </form>
)

const mapStateToProps = state => ({
  initialValues: state.checkout.data.address,
})

NewsletterForm = reduxForm({
  form: 'NewsletterForm', // a unique identifier for this form
  validate,
})(NewsletterForm)

NewsletterForm = withStyles(styles)(connect(mapStateToProps)(NewsletterForm))

export default NewsletterForm
