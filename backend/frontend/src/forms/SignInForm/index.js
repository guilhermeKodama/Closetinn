import React from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import classnames from 'classnames'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import { isValidEmail } from '../../utils/common'
import { renderTextField } from '../../utils/form'

const validate = values => {
  const errors = {}

  if (!values.email) {
    errors.email = 'E-mail em branco'
  } else if (!isValidEmail(values.email)) {
    errors.email = 'E-mail inválido'
  }

  if (!values.password) {
    errors.password = 'Senha em branco'
  }

  return errors
}

const SignInForm = ({
  classes,
  className,
  onSubmit,
}) => (
  <Form
    className={classnames(classes.root, className)}
    onSubmit={onSubmit}
    validate={validate}
    render={({ handleSubmit, submitting, pristine, invalid }) => (
      <form onSubmit={handleSubmit}>
        <Field
          className={classes.textField}
          type='email'
          name='email'
          component={renderTextField}
          label='E-mail'
          fullWidth
        />
        <Field
          className={classes.textField}
          type='password'
          name='password'
          component={renderTextField}
          label='Senha'
          fullWidth
        />
        <Button
          className={classes.button}
          fullWidth
          variant='contained'
          color='primary'
          type='submit'
          disabled={submitting || invalid || pristine}
        >
          Entrar
        </Button>
      </form>
    )}
  />
)

const mapStateToProps = state => ({
  initialValues: state.checkout.data.address,
})

export default withStyles(styles)(connect(mapStateToProps)(SignInForm))
