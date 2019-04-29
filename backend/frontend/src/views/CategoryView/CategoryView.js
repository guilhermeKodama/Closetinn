import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import Snackbar from '@material-ui/core/Snackbar'

import ProductGrid from '../../components/ProductGrid'
import Filter from '../../components/Filter'
import SelectFolderModal from '../../components/SelectFolderModal'
import FilterModal from '../../components/FilterModal'
import FilterOptionModal from '../../components/FilterOptionModal'

import { getClothes } from '../../actions/cloth'
import {
  getFilters,
  setFilter,
  setFilterPrice,
  removeFilter,
  clearFilter,
} from '../../actions/filters'
import { addClothToCart } from '../../actions/cart'
import {
  favoriteModalOpen,
  filterToggle,
} from '../../actions/app'

import {
  isLoadingSelector,
  openFilterSelector,
} from '../../selectors/app'
import {
  closetSelector,
  loggedSelector,
} from '../../modules/user/selectors'
import { clothesSelector } from '../../selectors/cloth'
import { filtersDataSelector } from '../../selectors/filters'

class CategoryView extends Component {
  state = {
    open: false,
    message: '',
    isFilterOptionOpen: false,
    currentPage: 0,
    offset: 12,
    currentFilter: null,
    maxOptions: 10,
  }

  componentDidMount() {
    const { clearFilter } = this.props
    clearFilter()
    this.fetch()
  }

  componentWillUnmount() {
    const { clearFilter } = this.props
    clearFilter()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentPage !== prevState.currentPage ||
        this.state.offset !== prevState.offset) {
      this.fetch()
    }
  }

  fetch = () => {
    const { location: { search }, getClothes, getFilters } = this.props,
          { currentPage, offset } = this.state

    const params = {
      currentPage,
      offset,
      query: search.replace('?', '&'),
    }

    getClothes(params)
    getFilters(params)
  }

  applyFilter = () => {
    this.fetch()
  }

  /**
   * Handle functions
   */

  handlePageChange = (e, currentPage) => {
    this.setState(() => ({ currentPage }))
  }

  handleRowsPerPageChange = e => {
    const offset = e.target.value
    this.setState(() => ({ offset }))
  }

  isFavorited = productId => {
    const { logged, closet } = this.props
    const allFavorites = {}

    if (logged) {
      closet.map(folder => folder.products.map(product => allFavorites[product._id] = true))
    }

    return allFavorites[productId]
  }

  onDetailClick = (e, cloth, index) => {
    window.dataLayer.push({
      'event': 'productClick',
      'ecommerce': {
        'currencyCode' : 'BRL',
        'click': {
          'actionField': { 'list': 'Category View' },
          'products': [{
            'name': cloth.productName,
            'id': cloth._id,
            'price': cloth.price,
            'brand': cloth.brand,
            'category': cloth.categories.join('/'),
            'position': index,
           }]
         }
       },
    })
    this.props.history.push(`/clothes/${cloth._id}`)
  }

  onFavoriteClick = (e, cloth, index) => {
    window.dataLayer.push({
      'event': 'addToCloset',
      'ecommerce': {
        'currencyCode' : 'BRL',
        'add': {
          'actionField': { 'list': 'Category View' },
          'products': [{
            'name': cloth.productName,
            'id': cloth._id,
            'price': cloth.price,
            'brand': cloth.brand,
            'category': cloth.categories.join('/'),
            'position': index,
           }]
         }
       },
    })
    const { logged, favoriteModalOpen } = this.props
    if (logged) {
      favoriteModalOpen(cloth)
    } else {
      this.props.history.push('/signin')
    }
  }

  onAddToCartClick = (e, cloth, product, index) => {
    window.dataLayer.push({
      'event': 'addToCart',
      'ecommerce': {
        'currencyCode' : 'BRL',
        'add': {
          'actionField': { 'list': 'Category View' },
          'products': [{
            'name': product.productName,
            'id': product._id,
            'price': product.price,
            'brand': product.brand,
            'category': product.categories.join('/'),
            'position': index,
            'quantity': cloth.quantity,
           }]
         }
       },
    })
    const { addClothToCart } = this.props
    addClothToCart(cloth)
    this.setState(() => ({ open: true, message: 'Adicionado ao carrinho' }))
  }

  onFilterSelect = (e, index) => {
    const { clothes: { filters } } = this.props
    const filter = filters[index]

    this.setState((prevState) => ({ isFilterOptionOpen: true, currentFilter: filter }))
  }

  onFilterOptionSelect = (e, filter, option) => {
    const { setFilter } = this.props
    setFilter({ filter, option })
  }

  onFilterOptionDeselect = (e, filter, option) => {
    const { removeFilter } = this.props
    removeFilter({ filter, option })
  }

  onPriceKeyPress = (e, filter, option) => {
    const { setFilterPrice } = this.props
    setFilterPrice({ filter, option })
    this.applyFilter()
  }

  onClearFiliter = e => {
    const { clearFilter, onFilterToggle } = this.props
    onFilterToggle()
    clearFilter()
  }

  onFilterClose = e => {
    this.props.onFilterToggle()
  }

  onFilterApply = e => {
    this.props.onFilterToggle()
    this.applyFilter()
  }

  onFilterOptionClose = e => {
    this.setState((prevState) => ({
      isFilterOptionOpen: !prevState.isFilterOptionOpen,
      currentFilter: null
    }))
  }

  onSnackbarClose = e => {
    this.closeSnackbar()
  }

  closeSnackbar = () => {
    this.setState(() => ({ open: false }))
  }

  render() {
    const { classes, isLoading, openFilter, clothes: { products, pagination }, filters: { filters, selectedFilters }, history } = this.props,
          { open, message, currentPage, offset, maxOptions, isFilterOptionOpen, currentFilter } = this.state

    return (
      <main className={classes.root}>
        {
          isLoading &&
          <div className={classes.progress}>
            <CircularProgress size={80} />
          </div>
        }
        <SelectFolderModal history={history} />
        {
          filters && !!filters.length && openFilter &&
          <FilterModal
            open={openFilter}
            filters={filters}
            selectedFilters={selectedFilters}
            onSelect={this.onFilterSelect}
            onFilterDelete={this.onFilterOptionDeselect}
            onClearFilter={this.onClearFiliter}
            onPriceKeyPress={this.onPriceKeyPress}
            onApply={this.onFilterApply}
            onClose={this.onFilterClose}
          />
        }
        {
          currentFilter && currentFilter.type === 'checkbox' &&
          <FilterOptionModal
            open={isFilterOptionOpen}
            selectedFilters={selectedFilters}
            currentFilter={currentFilter}
            onOptionSelect={this.onFilterOptionSelect}
            onOptionDeselect={this.onFilterOptionDeselect}
            onClose={this.onFilterOptionClose}
          />
        }
        <Grid
          className={classes.grid}
          container
        >
          <Hidden xsDown>
            <Grid item>
              <Filter
                filters={filters}
                selectedFilters={selectedFilters}
                onOptionSelect={(e, filter, option) => {
                  this.onFilterOptionSelect(e, filter, option)
                  this.applyFilter()
                }}
                onOptionDeselect={(e, filter, option) => {
                  this.onFilterOptionDeselect(e, filter, option)
                  this.applyFilter()
                }}
                onPriceKeyPress={this.onPriceKeyPress}
                maxOptions={maxOptions}
                onShowMore={this.handleShowMore}
              />
            </Grid>
          </Hidden>
          <Grid item xs>
            <ProductGrid
              products={products}
              pagination={pagination}
              currentPage={currentPage}
              rowsPerPage={offset}
              onPageChange={this.handlePageChange}
              onRowsPerPageChange={this.handleRowsPerPageChange}
              handleSelectPage={this.handleSelectPage}
              favorited={this.isFavorited}
              onDetail={this.onDetailClick}
              onAddToCart={this.onAddToCartClick}
              onFavorite={this.onFavoriteClick}
            />
          </Grid>
        </Grid>
        <Snackbar
          open={open}
          autoHideDuration={4000}
          disableWindowBlurListener={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          onClose={this.onSnackbarClose}
          ContentProps={{ 'aria-describedby': 'message-id' }}
          message={<span id='message-id'>{message}</span>}
        />
      </main>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isLoading: isLoadingSelector(),
  openFilter: openFilterSelector(),
  logged: loggedSelector(),
  closet: closetSelector(),
  clothes: clothesSelector(),
  filters: filtersDataSelector(),
})

const mapDispatchToProps = dispatch => ({
  favoriteModalOpen: product => dispatch(favoriteModalOpen(product)),
  getClothes: query => dispatch(getClothes(query)),
  getFilters: params => dispatch(getFilters(params)),
  onFilterToggle: () => dispatch(filterToggle()),
  setFilter: payload => dispatch(setFilter(payload)),
  setFilterPrice: payload => dispatch(setFilterPrice(payload)),
  removeFilter: payload => dispatch(removeFilter(payload)),
  clearFilter: () => dispatch(clearFilter()),
  addClothToCart: cloth => dispatch(addClothToCart(cloth)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CategoryView))
