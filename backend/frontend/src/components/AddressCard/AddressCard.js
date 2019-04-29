import React from 'react'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import AddressForm from '../../forms/AddressForm'

const AddressCard = ({ classes, address, readOnly, onPostcodeChange }) => {
  if(!readOnly) return <AddressForm onPostcodeChange={onPostcodeChange}/>

  return (
    <Grid className={classes.root} container>
      <Grid item xs={12}>
        <Typography variant='headline' paragraph>
          Endereço
        </Typography>
      </Grid>
      <Grid className={classes.gridItem} item xs={12}>
        <Typography color='textSecondary'>
          CEP
        </Typography>
        <Typography paragraph>
          {address && address.postcode}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography color='textSecondary'>
          Rua
        </Typography>
        <Typography paragraph>
          {address && address.street}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography color='textSecondary'>
          Numero
        </Typography>
        <Typography paragraph>
          {address && address.streetNumber}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography color='textSecondary'>
          Complemento
        </Typography>
        <Typography paragraph>
          {address && address.complement}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography color='textSecondary'>
          Bairro
        </Typography>
        <Typography paragraph>
          {address && address.neighborhood}
        </Typography>
      </Grid>
      <Grid className={classes.gridItem} item xs={12}>
        <Typography color='textSecondary'>
          Referência
        </Typography>
        <Typography paragraph>
          {address && address.reference}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Typography color='textSecondary'>
          Cidade
        </Typography>
        <Typography paragraph>
          {address && address.city}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Typography color='textSecondary'>
          Estado
        </Typography>
        <Typography paragraph>
          {address && address.state}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Typography color='textSecondary'>
          Telefone
        </Typography>
        <Typography paragraph>
          {address && address.phone}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(AddressCard)
