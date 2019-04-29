import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import {
  getPurchaseOrders,
  cancelPurchaseOrder,
} from '../../actions/purchaseOrder'

import { numeral } from '../../utils/common'

class MyOrdersView extends PureComponent {
  componentDidMount() {
    const { getPurchaseOrders } = this.props
    getPurchaseOrders()
  }

  handleCancelClick = po => e => {
    const { cancelPurchaseOrder } = this.props
    cancelPurchaseOrder(po._id)
  }

  renderItem = product => {
    const { classes } = this.props

    const bull = <span className={classes.bullet}>&#8226;</span>
    return (
      <Typography key={product.productName + product.size}>
        {bull} {product.productName}
      </Typography>
    )
  }

  renderStatus = status => {
    const { classes } = this.props

    if(status === 'enqueue' || status === 'progress') {
      return(
        <Typography className={classes.pos} color='textSecondary'>
          Processando
        </Typography>
      )
    }
    if(status === 'cancel') {
      return(
        <Typography className={classes.pos} color='textSecondary'>
          Cancelado
        </Typography>
      )
    }
    if(status === 'failed') {
      return(
        <Typography className={classes.pos} color='textSecondary'>
          Falhou
        </Typography>
      )
    }
    if(status === 'complete') {
      return(
        <Typography className={classes.pos} color='textSecondary'>
          Finalizado
        </Typography>
      )
    }
  }

  renderPO = po => {
    const { classes } = this.props

    return (
      <Grid
        key={po._id}
        className={classes.gridItem}
        item
        xs
        lg={3}
      >
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color='textSecondary'>
              #{po._id}
            </Typography>
            <Typography variant='headline' component='h2'>
              {numeral(po.totalPrice).format()}
            </Typography>
              { this.renderStatus(po.status) }
              { po.products.map(this.renderItem) }
          </CardContent>
          <CardActions>
            <Button onClick={this.handleCancelClick(po)} size='small'>Cancelar</Button>
          </CardActions>
        </Card>
      </Grid>
    )
  }

  render() {
    const { classes, purchaseOrders } = this.props
    return (
      <div className={classes.root}>
        <Grid
          className={classes.grid}
          container
          spacing={16}
        >
        { purchaseOrders && purchaseOrders.map(this.renderPO) }
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  purchaseOrders: state.user.data.purchaseOrders,
})

const mapDispatchToProps = dispatch => ({
  getPurchaseOrders: () => dispatch(getPurchaseOrders()),
  cancelPurchaseOrder: id => dispatch(cancelPurchaseOrder(id))
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MyOrdersView))
