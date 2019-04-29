import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import styles from './styles.js'

import * as analytics from '../../../utils/analytics'

import Look from '../../../components/Look'

import { withStyles } from '@material-ui/core/styles'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import { loadingSelector } from '../../../modules/app/selectors'

import { getMe } from '../../../modules/user/actions'
import {
  getRecommendationLooks,
  likeLook,
  dislikeLook,
} from '../../../modules/looks/actions'
import {
  likeProduct,
  dislikeProduct,
} from '../../../modules/products/actions'

import { looksSelector } from '../../../modules/looks/selectors'
import { userSelector } from '../../../modules/user/selectors'

import { click, EVENT } from '../../../utils/atena'

class LooksView extends Component {
  componentDidMount() {
    const {
      getMe,
      getRecommendationLooks,
      match: { params: { recommendationId } },
      location: { pathname, search },
    } = this.props

    const params = new URLSearchParams(search)
    const token = params.get('token')

    if (token) {
      getMe({ token, nextRoute: pathname })
    } else {
      getRecommendationLooks({ recommendationId })
    }
  }

  /**
   * Handle functions
   */

  handleLookLikeClick = (e, lookId, index) => {
    const { user, location: { pathname } } = this.props
    if (user) click(user._id, null, lookId, EVENT.LOOK_LIKE, pathname)

    analytics.likeLook(lookId, index, 'Looks Recommendations ')
    const { likeLook } = this.props
    likeLook({ lookId, index })
  }

  handleLookDislikeClick = (e, lookId, index) => {
    const { user, location: { pathname } } = this.props
    if (user) click(user._id, null, lookId, EVENT.LOOK_DISLIKE, pathname)

    analytics.dislikeLook(lookId, index, 'Looks Recommendations ')
    const { dislikeLook } = this.props
    dislikeLook({ lookId, index })
  }

  handleLookSelectClick = (e, lookId, index) => {
    const { user, location: { pathname } } = this.props
    if (user) click(user._id, null, lookId, EVENT.LOOK_CLICK, pathname)
  }

  handleProductLikeClick = (e, product, productIndex, lookIndex) => {
    const { user, location: { pathname } } = this.props
    if (user) click(user._id, product._id, null, EVENT.PRODUCT_LIKE, pathname)

    analytics.likeProduct(product, productIndex, lookIndex, 'Looks Recommendations ')
    const { likeProduct } = this.props,
          { _id: productId } = product
    likeProduct({ productId, lookIndex, productIndex })
  }

  handleProductDislikeClick = (e, product, productIndex, lookIndex) => {
    const { user, location: { pathname } } = this.props
    if (user) click(user._id, product._id, null, EVENT.PRODUCT_DISLIKE, pathname)

    analytics.dislikeProduct(product, productIndex, lookIndex, 'Looks Recommendations ')
    const { dislikeProduct } = this.props,
          { _id: productId } = product
    dislikeProduct({ productId, lookIndex, productIndex })
  }

  handleProductSelectClick = (e, product, productIndex, lookIndex) => {
    const { user, location: { pathname } } = this.props
    if (user) click(user._id, product._id, null, EVENT.PRODUCT_CLICK, pathname)

    analytics.productClick(product, productIndex, lookIndex , 'Looks Recommendations ')
    const url = product.trackingRrl || product.url
    window.open(url, '_blank')
  }

  render() {
    const { classes, width, loading, looks } = this.props
    
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
        {
          looks && !!looks.length &&
          <Fragment>
            <Typography
              className={classes.title}
              variant={isWidthUp('sm', width) ? 'headline' : 'subheading'}
              color='primary'
              align='center'
              paragraph
            >
              Selecione os looks e peças que mais te interessam, assim as recomendações ficam ainda mais assertivas.
            </Typography>
            <Look
              looks={looks}
              onLookSelect={this.handleLookSelectClick}
              onLookLike={this.handleLookLikeClick}
              onLookDislike={this.handleLookDislikeClick}
              onProductLike={this.handleProductLikeClick}
              onProductDislike={this.handleProductDislikeClick}
              onProductSelect={this.handleProductSelectClick}
            />
          </Fragment>
        }
      </main>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  user: userSelector(),
  loading: loadingSelector(),
  looks: looksSelector(),
})

const mapDispatchToProps = dispatch => ({
  getMe: payload => dispatch(getMe(payload)),
  getRecommendationLooks: payload => dispatch(getRecommendationLooks(payload)),
  likeLook: payload => dispatch(likeLook(payload)),
  dislikeLook: payload => dispatch(dislikeLook(payload)),
  likeProduct: payload => dispatch(likeProduct(payload)),
  dislikeProduct: payload => dispatch(dislikeProduct(payload)),
})

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LooksView)))
