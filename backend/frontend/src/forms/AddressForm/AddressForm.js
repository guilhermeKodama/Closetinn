import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import { renderTextField } from '../../utils/form'

const validate = values => {
  const errors = {}
  const requiredFields = [
    'postcode',
    'street',
    'streetNumber',
    'neighborhood',
    'city',
    'state',
    'phone',
    'reference',
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  })

  return errors
}

let AddressForm = ({ classes, handleSubmit, onPostcodeChange }) => {
  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant='headline' paragraph>Endereço</Typography>
        </Grid>
        <Grid className={classes.gridItem} item xs={12}>
          <Field
            name='postcode'
            component={renderTextField}
            label='CEP'
            onChange={onPostcodeChange}
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={12} sm={6}>
          <Field
            fullWidth
            name='street'
            component={renderTextField}
            label='Rua'
            disabled
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={12} sm={6}>
          <Field
            name='streetNumber'
            component={renderTextField}
            label='Número'
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={6}>
          <Field
            name='complement'
            fullWidth
            placeholder='Ex: Apartamento: 1, Bloco C'
            component={renderTextField}
            label='Complemento'
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={12} sm={6}>
          <Field
            name='neighborhood'
            fullWidth
            component={renderTextField}
            label='Bairro'
            disabled
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={12}>
          <Field
            name='reference'
            placeholder='Ex: Rua próxima a escola'
            fullWidth
            component={renderTextField}
            label='Referência'
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={6} sm={3}>
          <Field
            name='city'
            component={renderTextField}
            label='Cidade'
            disabled
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={6} sm={3}>
          <Field
            name='state'
            component={renderTextField}
            label='Estado'
            disabled
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={6} sm={3}>
          <Field
            name='phone'
            component={renderTextField}
            label='Telefone'
          />
        </Grid>
      </Grid>
    </form>
  )
}

const mapStateToProps = state => ({
  initialValues: state.checkout.data.address,
})

AddressForm = reduxForm({
  form: 'AddressForm', // a unique identifier for this form
  validate,
  destroyOnUnmount: false,
  enableReinitialize: true,
})(AddressForm)

AddressForm = withStyles(styles)(connect(mapStateToProps)(AddressForm))

export default AddressForm
