import { connect } from 'react-redux'
import React, { Component } from 'react'
import ProductGrid from '../../components/ProductGrid'

import styles from './styles'

import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'

import { actions as actionsSearch } from '../../modules/search/actions'

class Search extends Component {

  state: {
    search: null
  }

  handleChange = name => event => {
    const { search, type, pagination } = this.props
    const value = event.target.value
    this.setState({
      [name]: value
    })
    if(type === 'elasticsearch') {
      const offset = pagination && pagination.offset
      const currentPage = pagination && pagination.currentPage

      search(value, offset, currentPage)
    } else {
      search(value)
    }
  }

  handlePageChange = (e, currentPage) => {
    const { type, pagination } = this.props
    const { search } = this.state

    if(type === 'elasticsearch') {
      const offset = pagination && pagination.offset

      this.props.search(search, offset, currentPage)
    }
  }

  handleRowsPerPageChange = e => {
    const offset = e.target.value
    const { type, pagination } = this.props
    const { search } = this.state

    if(type === 'elasticsearch') {
      const currentPage = pagination && pagination.currentPage

      this.props.search(search, offset, currentPage)
    }
  }

  render() {
    const { classes, pagination, productsSearch, handleAdd } = this.props

    return (
      <div className={classes.root}>
        <Grid className={classes.gridItem} item xs={12}>
        <TextField
          id="search"
          placeholder="Encontre a sua roupa aqui :)"
          fullWidth
          className={classes.textField}
          onChange={this.handleChange('search')}
          margin="normal"
        />
        </Grid>
        <Grid className={classes.gridItem} item xs={12}>
          {
            productsSearch && !!productsSearch.length
            ? <ProductGrid
                pagination={pagination}
                currentPage={pagination && pagination.currentPage}
                rowsPerPage={pagination && pagination.offset}
                onRowsPerPageChange={this.handleRowsPerPageChange}
                onPageChange={this.handlePageChange}
                products={productsSearch}
                onDetail={handleAdd}
              />
            : <p> Nenhum produto encontrado </p>
          }
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  pagination: state.search.data && state.search.data.pagination,
  productsSearch: state.search.data && state.search.data.products
})

const mapDispatchToProps = dispatch => ({
  search: (query, offset, currentPage) => dispatch(actionsSearch.search(query, offset, currentPage)),
})

export default  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Search))
