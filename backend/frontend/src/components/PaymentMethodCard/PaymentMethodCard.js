import React from 'react'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import CreditCardForm from '../../forms/CreditCardForm'

const PaymentMethodCard = ({ classes, creditCard, readOnly }) => {
  if(!readOnly) return <CreditCardForm />

  return (
    <Grid className={classes.root} container>
      <Grid item xs={12}>
        <Typography variant='headline' paragraph>
          Pagamento
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography color='textSecondary'>
          Numero do cartão
        </Typography>
        <Typography paragraph>
          {creditCard && creditCard.number}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography color='textSecondary'>
          Nome no cartão
        </Typography>
        <Typography paragraph>
          {creditCard && creditCard.holder}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Typography color='textSecondary'>
          Data de validade
        </Typography>
        <Typography paragraph>
          {creditCard && creditCard.expirationMonth}/{creditCard && creditCard.expirationYear}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Typography color='textSecondary'>
          Codigo de segurança
        </Typography>
        <Typography paragraph>
          {creditCard && creditCard.securityCode}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(PaymentMethodCard)
