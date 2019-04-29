import React from 'react'
import cardValidator from 'card-validator'
import { Field, reduxForm } from 'redux-form'

import styles from './styles'

import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'

import { withStyles } from '@material-ui/core/styles'

import { renderTextField, renderSelectField } from '../../utils/form'

const validate = values => {
  const errors = {}
  const requiredFields = [
    'number',
    'holder',
    'expirationMonth',
    'expirationYear',
    'securityCode',
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  })

  const numberValidation = cardValidator.number(values['number'])
  if(!numberValidation.isValid) errors['number'] = 'Numero incorreto'

  const monthValidation = cardValidator.expirationMonth(values['expirationMonth'] && values['expirationMonth'].toString())
  if(!monthValidation.isPotentiallyValid) errors['expirationMonth'] = 'Mês invalido'

  const yearValidation = cardValidator.expirationYear(values['expirationYear'] && values['expirationYear'].toString())
  if(!yearValidation.isPotentiallyValid) errors['expirationYear'] = 'Ano invalido'

  const securityCodeValidation = cardValidator.cvv(values['securityCode'])
  if(!securityCodeValidation.isValid) errors['securityCode'] = 'Codigo inválido'

  return errors
}

let CreditCardForm = ({ classes, handleSubmit }) => {
  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <Grid container>
        <Grid className={classes.gridItem} item xs={12}>
          <Typography variant='headline' paragraph>
            Pagamento
          </Typography>
        </Grid>
        <Grid className={classes.gridItem} item xs={12} sm={6}>
          <Field
            name='number'
            fullWidth
            component={renderTextField}
            label='Numero do cartão'
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={12} sm={6}>
          <Field
            name='holder'
            fullWidth
            component={renderTextField}
            label='Nome no cartão'
          />
        </Grid>
        <Grid className={classes.gridItem} item xs sm={3}>
          <Field
            name='expirationMonth'
            component={renderSelectField}
            label='Mês'
          >
            {
              [...Array(12).keys()].map(value => <MenuItem key={value} value={value + 1}>{value + 1}</MenuItem>)
            }
          </Field>
        </Grid>
        <Grid className={classes.gridItem} item xs sm={3}>
          <Field
            name='expirationYear'
            component={renderSelectField}
            label='Ano'
          >
            {
              [...Array(40).keys()].map(value => <MenuItem key={value} value={value + 2018}>{value + 2018}</MenuItem>)
            }
          </Field>
        </Grid>
        <Grid className={classes.gridItem} item xs sm={3}>
          <Field
            name='securityCode'
            component={renderTextField}
            label='Codigo de segurança'
          />
        </Grid>
      </Grid>
    </form>
  )
}

CreditCardForm = reduxForm({
  form: 'CreditCardForm',
  validate,
  destroyOnUnmount: true,
})(CreditCardForm)

CreditCardForm = withStyles(styles)(CreditCardForm)

export default CreditCardForm
