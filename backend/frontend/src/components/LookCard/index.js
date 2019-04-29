import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Fade from '@material-ui/core/Fade'

import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'

import styles from './styles'

class LookCard extends Component {
  state = {
    hover: false
  }

  handleLikeClick = e => {
    const { look, onLike } = this.props
    onLike && onLike(look)
  }

  handleDislikeClick = e => {
    const { look, onDislike } = this.props
    onDislike && onDislike(look)
  }

  handleOnMouseEnter = e => {
    this.setState({ hover: true })
  }

  handleOnMouseLeave = e => {
    this.setState({ hover: false })
  }

  isFavorited = () => {
    const { look, favorited } = this.props

    if (typeof favorited === 'function') {
      return favorited(look._id)
    }
    return favorited
  }

  render() {
    const { 
      classes,
      className,
      look,
    } = this.props,
    { hover } = this.state

    return (
      <Card
        className={[classes.root, className].join(' ')}
        onMouseEnter={this.handleOnMouseEnter}
        onMouseLeave={this.handleOnMouseLeave}
      >
        <CardMedia
          className={classes.media}
          image={look.image}
          src='img'
          title='Look'
        />
        <CardContent>
          <Typography
            className={classes.productName}
            variant='subheading'
            gutterBottom
          >
            {look.productName}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Fade in={hover}>
            <IconButton
              aria-label='Like'
              onClick={this.handleLikeClick}
            >
              <Favorite size='snall'/>
            </IconButton>
          </Fade>
          <Fade in={hover}>
            <IconButton
              aria-label='Dislike'
              onClick={this.handleDislikeClick}
            >
              <FavoriteBorder size='snall'/>
            </IconButton>
          </Fade>
        </CardActions>
      </Card>
    )
  }
}

LookCard.propTypes = {
  look: PropTypes.object.isRequired,
  isEditMode: PropTypes.bool,
  favorited: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  onSelect: PropTypes.func,
  onFavorite: PropTypes.func,
  onEditMode: PropTypes.func,
  onRemove: PropTypes.func,
}

LookCard.defaultProps = {
  look: {
    "description": "A long description here",
    "title": "Title",
    "url": "https://www.dafiti.com.br/Calca-Jeans-Dzarm-Skinny-Berlin-Azul-3423834.html",
    "image_medium_url": "https://t-static.dafiti.com.br/8bMlWMJ7U4PwAgXByNJHO3ptJXY=/fit-in/430x623/dafitistatic-a.akamaihd.net%2fp%2fdzarm-cal%c3%a7a-jeans-dzarm-skinny-berlin-azul-3717-4383243-1-zoom.jpg",
    "productName": "Product Name",
    "price": 139.9,
},
  isEditMode: false,
}

export default withStyles(styles)(LookCard)
