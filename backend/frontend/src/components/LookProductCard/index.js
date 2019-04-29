import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import Like from '../../styles/icons/like-icon-white.svg'
import LikeSelected from '../../styles/icons/like-selected-icon.svg'
import Dislike from '../../styles/icons/dislike-icon-white.svg'
import DislikeSelected from '../../styles/icons/dislike-selected-icon.svg'

import { numeral } from '../../utils/common'

const LookProductCard = ({
  classes,
  width,
  className,
  index,
  lookIndex,
  product,
  onLike,
  onDislike,
  onSelect,
}) => {
  /**
   * Handle functions
   */

  const handleLikeClick = e => {
    e.stopPropagation()
    onLike && onLike(e, product, index, lookIndex,)
  }

  const handleDislikeClick = e => {
    e.stopPropagation()
    onDislike && onDislike(e, product, index, lookIndex)
  }

  const handleSelectClick = e => {
    onSelect && onSelect(e, product, index, lookIndex)
  }

  return (
    <Card className={[classes.root, className].join(' ')} elevation={8} onClick={handleSelectClick}>
      <CardMedia
        className={classes.media}
        image={product.image_medium_url || product.images_urls[0]}
        src='img'
        title='Teste'
      />
      <CardContent className={classes.content}>
        <Typography className={classes.productName} paragraph>{product.productName}</Typography>
        <Fragment>
          <span className={classes.text}>{product.priceOld ? 'de' : <br/> }</span>
          <span className={classes.strikethrough}>{product.priceOld ? numeral(product.priceOld).format() : '' }</span>
        </Fragment>
        <Typography variant='subheading'><strong>por {numeral(product.price).format()}</strong></Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        {
          width !== 'xs' &&
          <Typography color='inherit'>Gosta?</Typography>
        }
        <div>
          <IconButton
            aria-label='Like'
            color='inherit'
            onClick={handleLikeClick}
          >
            {
              product.liked ? <LikeSelected /> : <Like />
            }
          </IconButton>
          <IconButton
            aria-label='Dislike'
            color='inherit'
            onClick={handleDislikeClick}
          >
            {
              product.disliked ? <DislikeSelected /> : <Dislike />
            }
          </IconButton>
        </div>
      </CardActions>
    </Card>
  )
}

LookProductCard.propTypes = {
  image: PropTypes.string,
  onLike: PropTypes.func,
  onDislike: PropTypes.func,
}

LookProductCard.defaultProps = {
  image: '',
}

export default withWidth()(withStyles(styles)(LookProductCard))
