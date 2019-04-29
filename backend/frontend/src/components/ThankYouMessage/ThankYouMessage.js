import React from 'react'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const ThankYouMessage = ({ classes }) => {
  return (
    <Grid className={classes.root} container>
      <Grid item xs={12}>
        <Typography variant='headline' paragraph>
          O seu pedido foi realizado com sucesso
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          O seu pedido será processado nas proximas horas, nós enviamos um email com os detalhes do seu pedido.<br/>
          Quando o pedido for concluído você receberá um email de confirmação.<br/>
          Na tela Meus Pedidos você pode cancelar o seu pedido a qualquer momento, enquanto ele ainda estiver em processamento.
        </Typography>
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(ThankYouMessage)
