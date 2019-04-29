import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import TablePagination from '@material-ui/core/TablePagination'

import styles from './styles'

import Main from '../../../components/Main'
import LookCard from '../../../components/LookCard'

import { loadingSelector } from '../../../modules/app/selectors'

import { getLooks } from '../../../modules/looks/actions'
import {
  looksSelector,
  paginationSelector,
} from '../../../modules/looks/selectors'

class LooksView extends Component {
  state = {
    page: 0,
    offset: 25,
  }

  componentDidMount() {
    const { getLooks } = this.props,
          { page, offset } = this.state

    getLooks({ page, offset })
  }

  componentDidUpdate(prevProps, prevState) {
    const { page, offset } = this.state

    if (page !== prevState.page || offset !== prevState.offset) {
      const { getLooks } = this.props
      getLooks({ page, offset })
    }
  }

  /**
   * Handle functions
   */

  handleChangePage = (e, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = e => {
    const offset = e.target.value
    this.setState({ offset })
  }

  renderLook = (look, index) => {
    const { classes } = this.props

    return (
      <Grid
        key={look._id}
        item
        xs={6}
        sm={3}
        md={2}
      >
        <LookCard
          className={classes.productCard}
          index={index}
          look={look}
          onLike={this.handleProductLikeClick}
          onDislike={this.handleProductDislikeClick}
        />
      </Grid>
    )
  }

  render() {
    const { classes, loading, looks, pagination } = this.props,
          { page, offset } = this.state

    return (
      <Main className={classes.root}>
        {
          loading &&
          <div className={classes.progress}>
            <CircularProgress
              color='inherit'
              size={80}
            />
          </div>
        }
        <Grid
          className={classes.grid}
          container
          spacing={16}
        >
          {looks.map(this.renderLook)}
        </Grid>
        {
          !!looks.length &&
          <TablePagination
            component='div'
            count={pagination.totalItems}
            rowsPerPage={offset}
            page={page}
            backIconButtonProps={{ 'aria-label': 'Próxima Página' }}
            nextIconButtonProps={{ 'aria-label': 'Página Anterior' }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            labelRowsPerPage='Itens por página'
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        }
      </Main>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  loading: loadingSelector(),
  looks: looksSelector(),
  pagination: paginationSelector(),
})

const mapDispatchToProps = dispatch => ({
  getLooks: payload => dispatch(getLooks(payload)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LooksView))
