import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import AddShoppingCart from '@material-ui/icons/AddShoppingCart'

import { numeral } from '../../utils/common'

const ProductCard = ({
  classes,
  className,
  index,
  product,
  favorited,
  folderId,
  onFavorite,
  onAddToCart,
  onSelect,
  onRemove
}) => {
  const onSelectClick = e => {
    onSelect && onSelect(e, product, index)
  }

  const onFavoriteClick = e => {
    e.stopPropagation()
    onFavorite && onFavorite(e, product, index)
  }

  const onAddToCartClick = e => {
    e.stopPropagation()
    const cloth = { _id: product._id, size: product.sizes[0], quantity: 1 }
    onAddToCart && onAddToCart(e, cloth, product, index)
  }

  const onRemoveClick = e => {
    e.stopPropagation()
    onRemove && onRemove(e, folderId, product, index)
  }

  const isFavorited = () => {
    if (typeof favorited === 'function') {
      return favorited(product._id)
    }
    return favorited
  }

  return (
    <Card className={[classes.root, className].join(' ')} onClick={onSelectClick}>
      <CardMedia
        className={classes.cardMedia}
        image={product.image_medium_url || product.images_urls[0]}
        src="img"
        title={product.productName}
      />
      <CardContent>
        <Typography
          className={classes.productName}
          variant='subheading'
          gutterBottom
        >
          {product.productName}
        </Typography>
        <Typography
          className={`${product.disabled ? classes.unavailable : ''}`}
          variant={`${product.disabled ? 'subheading' : 'caption'}`}
          color='textSecondary'
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
      </CardContent>
      {
        (!!onFavorite || !!onAddToCart || !!onRemove) &&
        <CardActions
          className={classes.cardActions}
          disableActionSpacing
        >
          {
            !!onFavorite &&
            <Tooltip title='Adicionar ao closet'>
              <IconButton
                aria-label="Add to closet"
                onClick={onFavoriteClick}
              >
                { isFavorited() ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
              </IconButton>
            </Tooltip>
          }
          {
            !!onAddToCart &&
            <Tooltip title='Adicionar ao carrinho'>
              <IconButton
                className={classes.button}
                onClick={onAddToCartClick}
                disabled={product.disabled}
              >
                <AddShoppingCart />
              </IconButton>
            </Tooltip>
          }
          {
            !!onRemove &&
            <Button
              size="small" color="primary"
              onClick={onRemoveClick}
            >
            Remover
            </Button>
          }
        </CardActions>
    }
    </Card>
  )
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  isEditMode: PropTypes.bool,
  favorited: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  onSelect: PropTypes.func,
  onFavorite: PropTypes.func,
  onEditMode: PropTypes.func,
  onRemove: PropTypes.func,
}

ProductCard.defaultProps = {
  product: {
    "description": "A long description here",
    "title": "Title",
    "url": "https://www.dafiti.com.br/Calca-Jeans-Dzarm-Skinny-Berlin-Azul-3423834.html",
    "image_medium_url": "https://t-static.dafiti.com.br/8bMlWMJ7U4PwAgXByNJHO3ptJXY=/fit-in/430x623/dafitistatic-a.akamaihd.net%2fp%2fdzarm-cal%c3%a7a-jeans-dzarm-skinny-berlin-azul-3717-4383243-1-zoom.jpg",
    "productName": "Product Name",
    "price": 139.9,
},
  isEditMode: false,
}

export default withStyles(styles)(ProductCard)
