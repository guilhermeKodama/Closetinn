import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

// import ReactGA from '../../utils/analytics'

import { getRecommendationBasedOnDescription } from '../../actions/actionCreators'
import { favoriteModalOpen } from '../../actions/app'
import { getCloth } from '../../actions/cloth'
import {
  addClothToCart,
  updateClothCart,
  removeClothFromCart,
} from '../../actions/cart'

import ProductDetailInfo from '../../components/ProductDetailInfo'
import Recommendation from '../../components/Recommendation'
import SelectFolderModal from '../../components/SelectFolderModal'

import { isLoadingSelector } from '../../selectors/app'
import {
  loggedSelector,
  cartProductsSelector,
  closetSelector,
} from '../../modules/user/selectors'
import { clothesSelector } from '../../selectors/cloth'

class ClothDetailsView extends PureComponent {

  componentDidMount() {
    const { clothId } = this.props.match.params,
          {  getCloth, getRecommendationBasedOnDescription} = this.props

    getCloth(clothId)
    getRecommendationBasedOnDescription(clothId)
  }

  isFavorited = clothId => {
    const { logged, closet } = this.props
    const allFavorites = {}

    if (logged) {
      closet.map(folder => folder.products.map(product => allFavorites[product._id] = true))
    }

    return allFavorites[clothId]
  }

  addToCart = cloth => {
    const { addClothToCart } = this.props
    addClothToCart(cloth)
  }

  undoAddToCart = (_id, cloth) => {
    const { updateClothCart, removeClothFromCart } = this.props

    // backend must understand this corner case on update cloth cart controller (when quantity 0 the product should be removed from cart)
    if (cloth.quantity === 0) {
      removeClothFromCart(_id, cloth)
    } else {
      updateClothCart(_id, cloth)
    }
  }

  addToCloset = cloth => {
    const { logged, favoriteModalOpen, history } = this.props
    if (logged) {
      favoriteModalOpen(cloth)
    } else {
      history.push('/signin')
    }
  }

  viewDetails = cloth => {
    const { history } = this.props
    history.push(`/clothes/${cloth._id}`)
  }

  /**
   * Handle functions
   */

  handleAddToCartClick = (e, cloth) => {
    const { clothDetail } = this.props.clothes

    window.dataLayer.push({
      'event': 'addToCart',
      'ecommerce': {
        'currencyCode' : 'BRL',
        'add': {
          'products': [{
            'name': clothDetail.productName,
            'id': clothDetail._id,
            'price': clothDetail.price,
            'brand': clothDetail.brand,
            'category': clothDetail.categories.join('/'),
            'quantity': cloth.quantity,
           }]
         }
       },
    })
    this.addToCart(cloth)
  }

  handleUndoAddToCartClick = (_id, cloth) => {
    // ReactGA.event({ category: 'Buttons', action: 'Click', label: 'Cloth Details View: Undo Snackbar Add To Cart' })
    this.undoAddToCart(_id, cloth)
  }

  handleAddToClosetClick = (e, cloth) => {
    // ReactGA.event({ category: 'Buttons', action: 'Click', label: 'Cloth Details View: Add To Closet' })
    this.addToCloset(cloth)
  }

  handleViewDetailsRecommendationClick = (e, cloth) => {
    // ReactGA.event({ category: 'Button Links', action: 'Click', label: 'Cloth Details View: Recommendation Details View' })
    this.viewDetails(cloth)
  }

  handleAddToCartRecommendationClick = (e, cloth) => {
    // ReactGA.event({ category: 'Buttons', action: 'Click', label: 'Cloth Details View: Add Recommendation To Cart' })
    this.addToCart(cloth)
  }

  handleAddToClosetRecommendationClick = (e, cloth) => {
    // ReactGA.event({ category: 'Buttons', action: 'Click', label: 'Cloth Details View: Add Recommendation To Closet' })
    this.addToCloset(cloth)
  }

  render() {
    const { clothDetail, clothDetail: { descriptionBasedRecommendations } } = this.props.clothes,
          { classes, isLoading, cartProducts, history } = this.props

    return (
      <main className={classes.root}>
        {
          isLoading &&
          <div className={classes.progress}>
            <CircularProgress size={80} />
          </div>
        }
        <Fragment>
          {
            clothDetail &&
            <ProductDetailInfo
              className={classes.productDetailInfo}
              product={clothDetail}
              cartProducts={cartProducts}
              onAddToCart={this.handleAddToCartClick}
              onUndoAddToCart={this.handleUndoAddToCartClick}
              onAddToCloset={this.handleAddToClosetClick}
            />
          }
          {
            !!descriptionBasedRecommendations.length &&
            <Recommendation
              title='Produtos similares'
              products={descriptionBasedRecommendations}
              favorited={this.isFavorited}
              onViewDetails={this.handleViewDetailsRecommendationClick}
              onAddToCart={this.handleAddToCartRecommendationClick}
              onAddToCloset={this.handleAddToClosetRecommendationClick}
            />
          }
        </Fragment>
        <SelectFolderModal history={history} />
      </main>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isLoading: isLoadingSelector(),
  logged: loggedSelector(),
  closet: closetSelector(),
  clothes: clothesSelector(),
  cartProducts: cartProductsSelector(),
})

const mapDispatchToProps = dispatch => ({
  getCloth: clothId => dispatch(getCloth(clothId)),
  getRecommendationBasedOnDescription: clothId => dispatch(getRecommendationBasedOnDescription(clothId)),
  favoriteModalOpen: cloth => dispatch(favoriteModalOpen(cloth)),
  addClothToCart: cloth => dispatch(addClothToCart(cloth)),
  updateClothCart: (clothId, cloth) => dispatch(updateClothCart(clothId, cloth)),
  removeClothFromCart: (clothId, cloth) => dispatch(removeClothFromCart(clothId, cloth)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ClothDetailsView))
