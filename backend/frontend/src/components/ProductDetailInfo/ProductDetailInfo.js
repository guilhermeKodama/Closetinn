import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import MobileStepper from '@material-ui/core/MobileStepper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Chip from '@material-ui/core/Chip'
import Snackbar from '@material-ui/core/Snackbar'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Tooltip from '@material-ui/core/Tooltip'

import AddShoppingCart from '@material-ui/icons/AddShoppingCart'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'

import { numeral } from '../../utils/common'

class ProductDetailInfo extends PureComponent {
  state = {
    open: false,
    activeStep: 0,
    selectedSize: null,
    quantity: 1,
    oldQuantity: null,
    error: false,
  }

  onAddToCartClick = e => {
    const { product: { _id }, onAddToCart, cartProducts } = this.props,
          { selectedSize } = this.state

    const cartProduct = cartProducts.find(product => product._id === _id && product.size === selectedSize)
    if (cartProduct && cartProduct.quantity) {
      this.setState(prevState => ({ oldQuantity: cartProduct.quantity }))
    }

    if (selectedSize) {
      const cloth = { _id, size: selectedSize, quantity: 1 }
      onAddToCart && onAddToCart(e, cloth)
      this.setState(prevState => ({ open: true }))
    } else {
      this.setState(() => ({ error: true }))
    }
  }

  onStepChange = activeStep => {
    this.setState(() => ({ activeStep }))
  }

  onSizeClick = selectedSize => e => {
    this.setState(() => ({
      selectedSize,
      error: false,
    }))
  }

  onSnackbarClose = e => {
    this.closeSnackbar()
  }

  onSnackbarExit = e => {
    this.setState(() => ({
      oldQuantity: null,
      selectedSize: null,
    }))
  }

  onUndoClick = e => {
    const { product: { _id } } = this.props,
          { selectedSize, oldQuantity } = this.state
    const { onUndoAddToCart } = this.props
    onUndoAddToCart(_id, { size: selectedSize, quantity: oldQuantity || 0, newSize: selectedSize })
    this.closeSnackbar()
  }

  closeSnackbar = () => {
    this.setState(() => ({ open: false }))
  }

  onNextClick = () => {
    this.setState(prevState => ({ activeStep: prevState.activeStep + 1 }))
  }

  onBackClick = () => {
    this.setState(prevState => ({ activeStep: prevState.activeStep - 1 }))
  }

  renderImage = url => {
    const { classes, product } = this.props

    return (
      <div key={url} className={classes.imageContainer}>
        <img
          className={classes.image}
          src={url}
          alt={product.productName}
        />
      </div>
    )
  }

  renderSize = size => {
    const { classes } = this.props
    return (
      <Chip
        key={size}
        className={classes.chip}
        label={size}
        onClick={this.onSizeClick(size)}
        clickable
      />
    )
  }

  render() {
    const { classes, theme, className, product } = this.props,
          { activeStep, open, error } = this.state
    const maxSteps = product.images_urls ? product.images_urls.length : 0

    return (
      <Fragment>
        <Grid
          className={className}
          container
        >
          <Grid
            className={classes.gridItem}
            item
            xs={12}
            sm={7}
          >
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={activeStep}
              onChangeIndex={this.onStepChange}
              enableMouseEvents
            >
              { product.images_urls && product.images_urls.map(this.renderImage) }
            </SwipeableViews>
            <div className={classes.actions}>
              <IconButton
                aria-label='Previous image'
                onClick={this.onBackClick}
                disabled={activeStep === 0}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                aria-label='Next image'
                onClick={this.onNextClick}
                disabled={activeStep === maxSteps - 1}
              >
                <ChevronRight />
              </IconButton>
            </div>
            <MobileStepper
              className={classes.mobileStepper}
              steps={maxSteps}
              activeStep={activeStep}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm
          >
            <div className={classes.labels}>
              <Typography
                className={classes.title}
                variant='headline'
                paragraph
              >
                {product.title}
              </Typography>
              <Typography
                className={classes.productName}
                variant='title'
                paragraph
              >
                {product.productName}
              </Typography>
              <Typography
                className={`${product.disabled ? classes.unavailable : ''}`}
                variant={`${product.disabled ? 'subheading' : 'title'}`}
                paragraph
                noWrap
              >
                {
                  product.disabled ?
                    `Oferta indisponível`
                    :
                    product.priceOld ?
                    <Fragment>
                      <span>de </span>
                      <span className={classes.strikethrough}>{numeral(product.priceOld).format()}</span>
                      <span> por {numeral(product.price).format()}</span>
                    </Fragment>
                    :
                    numeral(product.price).format()
                }
              </Typography>
              <Typography
                className={classes.description}
                paragraph
              >
                {product.description}
              </Typography>
              {
                !product.disabled &&
                <Grid
                  item
                  xs={12}
                >
                  <FormControl className={classes.formControl} error={error}>
                    <FormLabel>Tamanho</FormLabel>
                    <List className={classes.list}>
                      {product.sizes && product.sizes.map(this.renderSize)}
                    </List>
                    <FormHelperText>Selecione um tamanho</FormHelperText>
                  </FormControl>
                </Grid>
              }
              <Grid
                item
                xs={12}
              >
                <Tooltip title='Adicionar ao carrinho'>
                  <Button
                    className={classes.button}
                    variant='contained'
                    color='primary'
                    onClick={this.onAddToCartClick}
                    disabled={product.disabled}
                  >
                    <AddShoppingCart className={classes.leftIcon}/>
                    Carrinho
                  </Button>
                </Tooltip>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <Snackbar
          open={open}
          autoHideDuration={4000}
          disableWindowBlurListener={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          onClose={this.onSnackbarClose}
          onExit={this.onSnackbarExit}
          ContentProps={{ 'aria-describedby': 'message-id' }}
          message={<span id='message-id'>Adicionado ao carrinho</span>}
          action={<Button key='undo' color='secondary' size='small' onClick={this.onUndoClick}>DESFAZER</Button>}
        />
      </Fragment>
    )
  }
}

ProductDetailInfo.propTypes = {
  product: PropTypes.object.isRequired,
}

ProductDetailInfo.defaultProps = {
  product: {
    images_urls: [],
    sizes: [],
  },
  onAddToCart: () => {},
}

export default withStyles(styles, { withTheme: true })(ProductDetailInfo)
