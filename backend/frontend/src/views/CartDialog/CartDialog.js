import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'

import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import Hidden from '@material-ui/core/Hidden'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import ExpandMore from '@material-ui/icons/ExpandMore'

import { cartToggle } from '../../actions/app'
import {
  getCart,
  removeClothFromCart,
  updateClothCart,
} from '../../actions/cart'

import CartItemDialog from '../../components/CartItemDialog'

import { numeral } from '../../utils/common'

const Transition = props => {
  return <Slide direction='up' {...props} />
}

class CartDialog extends PureComponent {
  componentDidMount() {
    const { getCart } = this.props
    getCart()
  }

  onRemoveClick = (_id, cloth) => {
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

  renderProduct = product => {
    const { classes } = this.props

    return (
      <Fragment key={product._id}>
        <ListItem
          className={classes.listItem}
          dense
        >
          <CartItemDialog
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
    const { classes, cart: { totalProductsPrice, deliveryPrice } } = this.props

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
                <Typography variant='headline'>{numeral(totalProductsPrice).format()}</Typography>
              </div>
              <div className={classes.contentRow}>
                <Typography variant='subheading'>Subtotal</Typography>
                <Typography variant='subheading'>{numeral(totalProductsPrice).format()}</Typography>
              </div>
              <div className={classes.contentRow}>
                <Typography variant='subheading'>Entrega</Typography>
                <Typography variant='subheading'>{numeral(deliveryPrice).format()}</Typography>
              </div>
              {/* <div className={classes.contentRow}>
                <Typography variant='subheading'>Taxas</Typography>
                <Typography variant='subheading'>{numeral(100).format()}</Typography>
              </div> */}
            </CardContent>
          </Card>
        </ListItem>
        <Divider />
      </Fragment>
    )
  }

  render() {
    const {
      classes,
      open,
      cart: { products, totalProductsPrice },
      cartToggle,
    } = this.props

    return (
      <Hidden smUp>
        <Dialog
          className={classes.root}
          fullScreen
          open={open}
          onClose={cartToggle}
          TransitionComponent={Transition}
        >
          <AppBar position='sticky'>
            <Toolbar disableGutters={true}>
              <IconButton
                color='inherit'
                aria-label='Close'
                onClick={cartToggle}
              >
                <ExpandMore />
              </IconButton>
              <Typography
                className={classes.toolbarTitle}
                color='inherit'
                variant='title'
              >
                Carrinho
              </Typography>
              <Typography
                className={classes.total}
                color='inherit'
                variant='title'
              >
                {numeral(totalProductsPrice).format()}
              </Typography>

            </Toolbar>
          </AppBar>
          <List>
            { products.map(this.renderProduct) }
            { this.renderTotal() }
          </List>
        </Dialog>
      </Hidden>
    )
  }
}

CartDialog.propTypes = {
  onClose: PropTypes.func,
  onRemoveClick: PropTypes.func,
}

CartDialog.defaultProps = {
  onClose: () => {},
  onRemoveClick: () => {},
}

const mapStateToProps = state => ({
  open: state.app.openCart,
  cart: state.user.data.cart,
})

const mapDispatchToProps = dispatch => ({
  cartToggle: () => dispatch(cartToggle()),
  getCart: () => dispatch(getCart()),
  removeClothFromCart: (productId, cloth) => dispatch(removeClothFromCart(productId, cloth)),
  updateClothCart: (productId, cloth) => dispatch(updateClothCart(productId, cloth)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CartDialog))
