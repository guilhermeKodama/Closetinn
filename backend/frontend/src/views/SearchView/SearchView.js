import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import ProductGrid from '../../components/ProductGrid'
import SelectFolderModal from '../../components/SelectFolderModal'

import { favoriteModalOpen } from '../../actions/app'
import { addClothToCart } from '../../actions/cart'

class SearchView extends Component {

  isFavorited = productId => {
    const { user } = this.props
    const allFavorites = {}

    if (user.data.logged) {
      user.data.closet.map(folder => folder.products.map(product => allFavorites[product._id] = true))
    }

    return allFavorites[productId]
  }

  onDetailClick = (e, cloth) => {
    this.props.history.push(`/clothes/${cloth._id}`)
  }

  onAddToCartClick = (e, cloth) => {
    const { addClothToCart } = this.props
    addClothToCart(cloth)
    this.setState(() => ({ open: true, message: 'Adicionado ao carrinho' }))
  }

  onFavoriteClick = (e, product) => {
    const { user, favoriteModalOpen } = this.props

    if (user.data.logged) {
      favoriteModalOpen(product)
    } else {
      this.props.history.push('/signin')
    }
  }

  handleSelectPage = (pageNumber) => {
    const { search } = this.props.location
    const params = new URLSearchParams(search)

    const gender = params.get('gender') || ''
    const subCategory = params.get('subCategory') || ''
    const parentCategory = params.get('parentCategory') || ''

    const paginationData = {
      gender,
      currentPage: pageNumber,
      subCategory,
      parentCategory,
      offset: 20
    }

    this.props.getProductsCategory(paginationData)
    this.props.getProductsFilters(paginationData)
  }

  render() {
    const { search, classes, history, onDetailClick } = this.props
    return (
      <div className={classes.root}>
        <SelectFolderModal history={history} />
        <Grid container>
          {
            (!search.error && search.products.length > 0) &&
            <Grid item xs>
              <ProductGrid
                products={search.products}
                handleSelectPage={this.handleSelectPage}
                favorited={this.isFavorited}
                onDetail={onDetailClick || this.onDetailClick}
                onAddToCart={this.onAddToCartClick}
                onFavorite={this.onFavoriteClick}
              />
            </Grid>
          }
          {
            (search.error || search.products.length === 0) &&
            <p>Product Not Found :/</p>
          }
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  search: state.search,
})

const mapDispatchToProps = dispatch => ({
  favoriteModalOpen: product => dispatch(favoriteModalOpen(product)),
  addClothToCart: cloth => dispatch(addClothToCart(cloth)),
})

export default  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SearchView))
