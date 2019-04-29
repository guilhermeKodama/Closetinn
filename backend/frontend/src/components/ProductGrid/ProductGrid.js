import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination'

import ProductCard from '../../components/ProductCard'

class ProductGrid extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.products !== nextProps.products ||
           this.props.width !== nextProps.width
  }

  isFavoritedCheck = productId => {
    const { favorited } = this.props
    return favorited && favorited(productId)
  }

  onSelectClick = (e, cloth, index) => {
    const { onDetail } = this.props
    onDetail && onDetail(e, cloth, index)
  }

  onFavoriteClick = (e, cloth, index) => {
    const { onFavorite } = this.props
    onFavorite && onFavorite(e, cloth)
  }

  onAddToCartClick = (e, cloth, product, index) => {
    const { onAddToCart } = this.props
    onAddToCart && onAddToCart(e, cloth, product, index)
  }

  renderProduct = (product, index) => {
    const { classes } = this.props

    if (product) {
      return (
        <Grid
          className={classes.gridItem}
          key={product._id}
          item
          xs={6}
          md={3}
        >
          <ProductCard
            index={index}
            product={product}
            favorited={this.isFavoritedCheck}
            onSelect={this.onSelectClick}
            onFavorite={this.onFavoriteClick}
            onAddToCart={this.onAddToCartClick}
          />
        </Grid>
      )
    }

    return null
  }

  render() {
    const {
      classes,
      width,
      products,
      pagination,
      currentPage,
      rowsPerPage,
      rowsPerPageOptions,
      onPageChange,
      onRowsPerPageChange,
    } = this.props

    return (
      <Fragment>
        <Grid
          className={classes.grid}
          container
          spacing={width === 'xs' ? 8 : 16}
        >
          { products.map(this.renderProduct) }
        </Grid>
        {
          pagination && !!pagination.totalItems &&
          <TablePagination
            className={classes.pagination}
            classes={{
              caption: classes.caption,
              select: classes.select,
            }}
            component='div'
            count={pagination.totalItems}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            backIconButtonProps={{ 'aria-label': 'Previous Page' }}
            nextIconButtonProps={{ 'aria-label': 'Next Page' }}
            onChangePage={onPageChange}
            onChangeRowsPerPage={onRowsPerPageChange}
            rowsPerPageOptions={rowsPerPageOptions || [12, 24, 36]}
            labelRowsPerPage={width === 'xs' ? 'Itens': 'Itens por página'}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        }
      </Fragment>
    )
  }
}

ProductGrid.propTypes = {
  products: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  favorited: PropTypes.func,
  onDetail: PropTypes.func,
  onFavorite: PropTypes.func,
  onAddToCart: PropTypes.func,
}

ProductGrid.defaultProps = {
  products: [],
  pagination: {
    currentPage: 0,
    totalPages: 0
  },
}

export default withStyles(styles)(withWidth()(ProductGrid))
