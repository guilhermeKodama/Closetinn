import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import LookImage from '../../components/LookImage'
import LookProductCard from '../../components/LookProductCard'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

const Look = ({
  classes,
  className,
  looks,
  onLookSelect,
  onLookLike,
  onLookDislike,
  onProductLike,
  onProductDislike,
  onProductSelect,
}) => {
  const renderLook = (look, index) => (
    <div key={look._id} className={classes.look}>
      <LookImage
        className={classes.lookCard}
        index={index}
        look={look}
        onSelect={onLookSelect}
        onLike={onLookLike}
        onDislike={onLookDislike}
      />
      <Grid
        className={classes.grid}
        container
        spacing={16}
      >
        { look.products.map(renderLookProduct(index)) }
      </Grid>
    </div>
  )

  const renderLookProduct = lookIndex => (product, index) => (
    <Grid
      key={product._id}
      item
      xs={6}
      sm
      md
    >
      <LookProductCard
        className={classes.productCard}
        index={index}
        lookIndex={lookIndex}
        product={product}
        onLike={onProductLike}
        onDislike={onProductDislike}
        onSelect={onProductSelect}
      />
    </Grid>
  )

  return (
    <div className={[classes.root, className].join(' ')}>
      {
        looks.map(renderLook)
      }
    </div>
  )
}

Look.propTypes = {
  looks: PropTypes.array.isRequired,
}

export default withStyles(styles)(Look)
