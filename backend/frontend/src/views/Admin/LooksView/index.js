import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import styles from './styles.js'

import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TablePagination from '@material-ui/core/TablePagination'
import Badge from '@material-ui/core/Badge'

import { loadingSelector } from '../../../modules/app/selectors'

import { getLooks } from '../../../modules/looks/actions'
import {
  looksSelector,
  paginationSelector,
} from '../../../modules/looks/selectors'

import { checkDisabledProducts } from '../../../utils/products'

class LooksRecommendationsView extends Component {
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

  handleLookClick = look => e => {
    const { history } = this.props
    history.push(`/admin/looks/${look._id}`)
  }

  renderLook = look => {
    const { classes } = this.props,
          badge = checkDisabledProducts(look.products)

    return (
      <Grid
        key={look._id}
        item
        xs={6}
        sm={3}
      >
          <Card
            className={classes.card}
            elevation={8}
            onClick={this.handleLookClick(look)}
          >
            <CardMedia
              className={classes.media}
              image={look.image}
              src='img'
              title='Teste'
            />
            {
              !!badge &&
              <CardContent>
                <Badge classes={{ badge: classes.badge }} badgeContent={badge} color='secondary'>
                  <Typography color='textSecondary'>Produtos sem estoque</Typography>
                </Badge>
              </CardContent>
            }
          </Card>
      </Grid>
    )
  }

  render() {
    const { classes, loading, looks, pagination } = this.props,
          { page, offset } = this.state

    return (
      <main className={classes.root}>
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
      </main>
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LooksRecommendationsView))
