import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TablePagination from '@material-ui/core/TablePagination'

import PromotionCard from '../../components/PromotionCard'

class PromotionGrid extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.promotions !== nextProps.promotions ||
           this.props.width !== nextProps.width
  }

  /**
   * Handle functions
   */

  handlePromotionClick = (promotion, index) => e => {
    const { onPromotion } = this.props
    onPromotion(e, promotion, index)
  }

  handleShowAllClick = e => {
    const { onShowAll } = this.props
    onShowAll(e)
  }

  renderPromotion = (promotion, index) => {
    const { classes } = this.props

    return (
      <Grid
        key={promotion._id}
        className={classes.gridItem}
        item
        xs={12}
        sm={6}
        md={3}
      >
        <PromotionCard
          promotion={promotion}
          onClick={this.handlePromotionClick(promotion, index)}
        />
      </Grid>
    )
  }

  render() {
    const {
      classes,
      width,
      className,
      promotions,
      pagination,
      currentPage,
      rowsPerPage,
      rowsPerPageOptions,
      onPageChange,
      onRowsPerPageChange,
      showAll,
      onShowAll
    } = this.props

    let spacing = 24
    if (width === 'xs' || width === 'sm') {spacing = 16}

    return (
      <div className={[classes.root, className].join(' ')}>
        <div>
          <Typography
            className={classes.title}
            variant='display1'
            align='center'
            paragraph
          >
            PROMOÇÕES
          </Typography>
          <Typography
            variant='headline'
            align='center'
          >
            Confira as categorias com maiores descontos
          </Typography>
        </div>
        <Grid
          className={classes.grid}
          container
          spacing={spacing}
        >
          { promotions.map(this.renderPromotion) }
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
        <div className={classes.actions}>
          <Typography
            variant='caption'
            align='center'
          >
            *Promoções válidas enquanto durarem os estoques. Os valores informados de desconto são referentes a alguns produtos, sendo que alguns deles podem ter descontos menores ou maiores. Os preços estão sujeitos a alterações sem aviso prévio, assim como os descontos. Variações de uma mesma peça podem apresentar descontos distintos. Em caso de diferença de preço, o preço correto é o indicado após adicionar o produto ao carrinho. Durante o período de SALE serão o processo de devoluções é acordo com a nossa Política de Devoluções da Loja, O CLOSETINN realiza apenas a mediação e apresentação dos produtos em oferta em outras lojas, por tanto, não se responsabilizará por possíveis erros na entrega e/ou devolução de produtos.
          </Typography>
          {
            (showAll || onShowAll) &&
            <Button
              className={classes.button}
              size='large'
              color='primary'
              variant='contained'
              onClick={this.handleShowAllClick}
            >
              Ver todas as ofertas
            </Button>
          }
        </div>
      </div>
    )
  }
}

PromotionGrid.propTypes = {
  promotions: PropTypes.array.isRequired,
  onPromotion: PropTypes.func,
  onShowAll: PropTypes.func,
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
}

PromotionGrid.defaultProps = {
  promotions: [],
  onPromotion: () => {},
  rowsPerPageOptions: [12, 24, 36],
}

export default withWidth()(withStyles(styles)(PromotionGrid))
