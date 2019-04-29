import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles.js'
import { withStyles } from '@material-ui/core/styles'
import ProductCard from '../../components/ProductCard'
import Grid from '@material-ui/core/Grid'

import { removeProductFromClosetFolder } from '../../actions/closet'

class ClosetView extends Component {

  onSelectProductCard = (e, cloth) => {
    this.props.history.push(`/clothes/${cloth._id}`)
  }

  onProductCardRemove = (e, folderId, cloth, index) => {
    window.dataLayer.push({
      'event': 'removeFromCloset',
      'ecommerce': {
        'currencyCode' : 'BRL',
        'remove': {
          'actionField': { 'list': 'Closet View' },
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
    this.props.removeProductFromClosetFolder(folderId, cloth._id)
  }

  render() {
    const { classes, closet, match: { params: { folderId } } } = this.props
    const selectedFolder = closet.filter(folder => folder._id === folderId)
    return (
      <div className={classes.root}>
        <Grid className={classes.grid} container spacing={24}>

          {
            (selectedFolder.length > 0) && selectedFolder[0].products.map((product, index) =>
              <Grid item xs={6} sm={3}>
                <ProductCard
                  key={product._id}
                  folderId={selectedFolder[0]._id}
                  index={index}
                  product={product}
                  favorited
                  onSelect={this.onSelectProductCard}
                  onRemove={this.onProductCardRemove}
                />
              </Grid>
            )
          }
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  closet: state.user.data.closet
})

const mapDispatchToProps = dispatch => ({
  removeProductFromClosetFolder: (folderId, productId) => dispatch(removeProductFromClosetFolder(folderId, productId))
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ClosetView))
