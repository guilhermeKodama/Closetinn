import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'

import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline'

import { numeral } from '../../utils/common'

class CartItemDialog extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      size: props.product.size,
      quantity: props.product.quantity,
    }
  }

  onRemoveClick = e => {
    const { index, product, product: { _id, size } } = this.props
    const cloth = { size }
    this.props.onRemove(_id, cloth, product, index)
  }

  onSizeChange = e => {
    const newSize = e.target.value
    this.setState(() => ({ size: newSize }))
    const { product: { _id, size, quantity } } = this.props
    this.props.onSizeChange(_id, { size, quantity, newSize })
  }

  onQuantityChange = e => {
    const quantity = e.target.value
    this.setState(() => ({ quantity }))
    const { product: { _id, size } } = this.props
    this.props.onQuantityChange(_id, { size, quantity, newSize: size })
  }

  renderSize = size => (
    <MenuItem key={size} value={size}>
      {size}
    </MenuItem>
  )

  renderQuantity = quantity => (
    <MenuItem key={quantity} value={quantity}>
      {quantity}
    </MenuItem>
  )

  render() {
    const { classes, product } = this.props,
          { size, quantity } = this.state

    return (
      <Card className={classes.root} elevation={0}>
        <CardActions>
          <IconButton
            className={classes.button}
            color='inherit'
            aria-label='Close'
            onClick={this.onRemoveClick}
          >
            <RemoveCircleOutline />
          </IconButton>
        </CardActions>
        <CardContent className={classes.cardContent}>
          <img
            className={classes.cardMedia}
            src={product.image_medium_url}
            alt={product.productName}
          />
          <div className={classes.cardDetails}>
            <Typography variant='subheading'>{product.title}</Typography>
            <Typography variant='caption'>
              {product.productName}
            </Typography>
            <div className={classes.contentRow}>
              <Typography variant='caption' >
                {numeral(product.price).format()}
              </Typography>
              <Typography variant='caption' >
                {`/ ${product.quantity} x ${numeral(product.price * product.quantity).format()}`}
              </Typography>
            </div>
            <TextField
              select
              label='Tamanho'
              className={classes.textField}
              value={size}
              onChange={this.onSizeChange}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin='none'
            >
              { product.sizes.map(this.renderSize) }
            </TextField>
            <TextField
              select
              label='Quantidade'
              className={classes.textField}
              value={quantity}
              onChange={this.onQuantityChange}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin='none'
            >
              { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(this.renderQuantity) }
            </TextField>
          </div>
        </CardContent>
      </Card>
    )
  }
}

CartItemDialog.propTypes = {
  product: PropTypes.object,
  onRemove: PropTypes.func,
  onSizeChange: PropTypes.func,
  onQuantityChange: PropTypes.func,
}

CartItemDialog.defaultProps = {
  product: {
    sizes: [],
  },
  onRemove: () => {},
  onSizeChange: () => {},
  onQuantityChange: () => {},
}

export default withStyles(styles)(CartItemDialog)
