import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import ProductCard from '../ProductCard'

const Recommendation = ({
  classes,
  className,
  title,
  products,
  favorited,
  onViewDetails,
  onAddToCloset,
  onAddToCart,
}) => {
  const isFavorited = productId => {
    return favorited && favorited(productId)
  }

  const onSelectClick = (e, productId) => {
    onViewDetails && onViewDetails(e, productId)
  }

  const onFavoriteClick = (e, cloth) => {
    onAddToCloset && onAddToCloset(e, cloth)
  }

  const onAddToCartClick = (e, cloth) => {
    onAddToCart && onAddToCart(e, cloth)
  }

  const renderProduct = product => (
    <ProductCard
      key={product._id + product.size}
      className={classes.item}
      product={product}
      favorited={isFavorited}
      onSelect={onSelectClick}
      onFavorite={onFavoriteClick}
      onAddToCart={onAddToCartClick}
    />
  )

  return (
    <Fragment>
      <Typography
        variant='title'
        paragraph
        noWrap
      >
        {title}
      </Typography>
      <div className={[classes.scroll, className].join(' ')}>
        {
          products.map(renderProduct)
        }
      </div>
    </Fragment>
  )
}

Recommendation.propTypes = {
  produtcs: PropTypes.array,
  favorited: PropTypes.func,
  onViewDetails: PropTypes.func,
  onAddToCloset: PropTypes.func,
  onAddToCart: PropTypes.func,
}

Recommendation.defaultProps = {
  produtcs: []
}

export default withStyles(styles)(Recommendation)
