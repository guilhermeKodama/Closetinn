import React, { Component, Fragment} from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { click, EVENT } from '../../../utils/atena'

import LookProductCard from '../../../components/LookProductCard'

import { getMe } from '../../../modules/user/actions'
import { getRecommendationPromotions } from '../../../modules/promotions/actions'
import {
  likeProduct,
  dislikeProduct,
} from '../../../modules/products/actions'

import { loadingSelector } from '../../../modules/app/selectors'
import { userSelector } from '../../../modules/user/selectors'
import { promotionsSelector } from '../../../modules/promotions/selectors'

class ProductsPromotionsRecommedationView extends Component {
  componentDidMount() {
    const {
      getMe,
      getRecommendationPromotions,
      match: { params: { recommendationId } },
      location: { pathname, search },
    } = this.props

    const params = new URLSearchParams(search)
    const token = params.get('token')

    if (token) {
      getMe({ token, nextRoute: pathname })
    } else {
      getRecommendationPromotions({ recommendationId })
    }
  }

  /**
   * Handle functions
   */

   handleProductLikeClick = (e, product, productIndex) => {
     const { user, location: { pathname } } = this.props
     click(user._id, product._id, null, EVENT.PRODUCT_LIKE, pathname)

     const { likeProduct } = this.props,
           { _id: productId } = product
     likeProduct({ productId, productIndex })
   }

   handleProductDislikeClick = (e, product, productIndex) => {
     const { user, location: { pathname } } = this.props
     click(user._id, product._id, null, EVENT.PRODUCT_DISLIKE, pathname)

     const { dislikeProduct } = this.props,
           { _id: productId } = product
     dislikeProduct({ productId, productIndex })
   }

   handleProductSelectClick = (e, product, productIndex) => {
     const { user, location: { pathname } } = this.props
     click(user._id, product._id, null, EVENT.PRODUCT_CLICK, pathname)

     const url = product.trackingRrl || product.url
     window.open(url, '_blank')
   }

  renderProduct = (product, index) => {
    const { classes } = this.props

    return (
      <Grid
        key={product._id}
        item
        xs={6}
        sm={4}
      >
        <LookProductCard
          className={classes.productCard}
          index={index}
          product={product}
          onLike={this.handleProductLikeClick}
          onDislike={this.handleProductDislikeClick}
          onSelect={this.handleProductSelectClick}
        />
      </Grid>
    )
  }

  render() {
    const { classes, width, loading, promotions } = this.props

    return (
      <main className={classes.root}>
        {
          loading &&
          <div className={classes.progress}>
            <CircularProgress size={80} />
          </div>
        }
        {
          !!promotions.length &&
          <Fragment>
            <Typography
              className={classes.title}
              variant={isWidthUp('sm', width) ? 'headline' : 'subheading'}
              color='primary'
              align='center'
              paragraph
            >
              Curta os produtos que mais te interessam, assim as recomendações ficam ainda mais assertivas.
            </Typography>
            <Grid
              container
              justify='flex-start'
              spacing={16}
            >
              { promotions.map(this.renderProduct) }
            </Grid>
          </Fragment>
        }
      </main>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  loading: loadingSelector(),
  user: userSelector(),
  promotions: promotionsSelector(),
})

const mapDispatchToProps = dispatch => ({
  getMe: payload => dispatch(getMe(payload)),
  getRecommendationPromotions: params => dispatch(getRecommendationPromotions(params)),
  likeProduct: payload => dispatch(likeProduct(payload)),
  dislikeProduct: payload => dispatch(dislikeProduct(payload)),
})

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProductsPromotionsRecommedationView)))
