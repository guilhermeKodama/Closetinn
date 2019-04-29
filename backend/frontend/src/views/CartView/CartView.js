import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

import {
  getCart,
  removeClothFromCart,
  updateClothCart,
} from '../../actions/cart'

import CartItemDialog from '../../components/CartItemDialog'

import { numeral } from '../../utils/common'

class CartView extends PureComponent {
  componentDidMount() {
    const { getCart } = this.props
    getCart()
  }

  onRemoveClick = (_id, cloth, product, index) => {
    window.dataLayer.push({
      'event': 'removeFromCart',
      'ecommerce': {
        'currencyCode' : 'BRL',
        'remove': {
          'actionField': { 'list': 'Cart View' },
          'products': [{
            'name': product.productName,
            'id': product._id,
            'price': product.price,
            'brand': product.brand,
            'category': product.categories.join('/'),
            'position': index,
           }]
         }
       },
    })
    const { removeClothFromCart } = this.props
    removeClothFromCart(_id, cloth)
  }

  onSizeChange = (_id, cloth) => {
    const { updateClothCart } = this.props
    updateClothCart(_id, cloth)
  }

  onQuantityChange = (_id, cloth) => {
    const { updateClothCart } = this.props
    updateClothCart(_id, cloth)
  }

  renderProduct = (product, index) => {
    const { classes } = this.props

    return (
      <Fragment key={product._id + product.size}>
        <ListItem
          className={classes.listItem}
          dense
        >
          <CartItemDialog
            index={index}
            product={product}
            onRemove={this.onRemoveClick}
            onSizeChange={this.onSizeChange}
            onQuantityChange={this.onQuantityChange}
          />
        </ListItem>
        <Divider className={classes.divider}/>
      </Fragment>
    )
  }

  renderTotal = () => {
    const { classes, cart: { totalPrice, totalProductsPrice, deliveryPrice }, readOnly } = this.props

    return (
      <Fragment>
        <ListItem
          className={classes.listItem}
          dense
        >
          <Card className={classes.card} elevation={0}>
            <CardContent className={classes.cardContent}>
              <div className={classes.contentRow}>
                <Typography variant='subheading'>TOTAL</Typography>
                <Typography variant='headline'>{readOnly ? numeral(totalPrice).format() : numeral(totalProductsPrice).format()}</Typography>
              </div>
              <div className={classes.contentRow}>
                <Typography variant='subheading'>Subtotal</Typography>
                <Typography variant='subheading'>{numeral(totalProductsPrice).format()}</Typography>
              </div>
              {
                readOnly &&
                <div className={classes.contentRow}>
                  <Typography variant='subheading'>Entrega</Typography>
                  <Typography variant='subheading'>{numeral(deliveryPrice).format()}</Typography>
                </div>
                /*<div className={classes.contentRow}>
                  <Typography variant='subheading'>Taxas</Typography>
                  <Typography variant='subheading'>{numeral(100).format()}</Typography>
                </div>*/
              }
            </CardContent>
          </Card>
        </ListItem>
        <Divider />
      </Fragment>
    )
  }

  handleFinishCartClick = () => {
    const { history } = this.props
    history.push('/checkout')
  }

  render() {
    const {
      classes,
      cart: { products },
      readOnly
    } = this.props

    return (
      <main className={classes.root}>
        <Grid
          container
          spacing={16}
        >
          {
            products.length > 0 &&
            <Grid item xs>
              <List className={classes.list}>
                { products.map(this.renderProduct) }
              </List>
            </Grid>
          }
          {
            products.length > 0 &&
            <Grid item xs>
              <List className={classes.list}>
                { this.renderTotal() }
              </List>
            </Grid>
          }
          {
            products.length === 0 &&
            // melhorar isso
            <h2> Nenhum produto no carrinho. </h2>
          }
          {
            products.length > 0 && !readOnly &&
            <Grid className={classes.grid} item xs={12}>
              <Button onClick={this.handleFinishCartClick} size="large" variant="contained" color="primary" className={classes.button}>
                Finalizar Compra
              </Button>
            </Grid>
          }
        </Grid>
      </main>
    )
  }
}

const mapStateToProps = state => ({
  cart: state.user.data.cart
})

const mapDispatchToProps = dispatch => ({
  getCart: () => dispatch(getCart()),
  removeClothFromCart: (productId, cloth) => dispatch(removeClothFromCart(productId, cloth)),
  updateClothCart: (productId, cloth) => dispatch(updateClothCart(productId, cloth)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CartView))
