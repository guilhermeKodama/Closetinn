import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import Like from '../../styles/icons/like-icon.svg'
import LikeSelected from '../../styles/icons/thumbs-up.svg'
import Dislike from '../../styles/icons/dislike-icon.svg'
import DislikeSelected from '../../styles/icons/thumbs-down.svg'

const LookImage = ({
  classes,
  className,
  index,
  look,
  onSelect,
  onLike,
  onDislike,
}) => {
  /**
   * Handle functions
   */

  const handleSelectClick = e => {
    const { _id } = look
    onSelect && onSelect(e, _id, index)
  }

  const handleLikeClick = e => {
    const { _id } = look
    onLike && onLike(e, _id, index)
  }

  const handleDislikeClick = e => {
    const { _id } = look
    onDislike && onDislike(e, _id, index)
  }

  return (
    <div className={[classes.root, className].join(' ')}>
      <Card className={classes.card} elevation={8}>
        <CardMedia
          onClick={handleSelectClick}
          className={classes.media}
          image={look.image}
          src='img'
          title='Teste'
        />
      </Card>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography variant='headline' color='inherit'>Gosta?</Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <IconButton
            aria-label='Like'
            color='inherit'
            onClick={handleLikeClick}
          >
            {
              look.liked ? <LikeSelected /> : <Like />
            }
          </IconButton>
          <IconButton
            className={classes.button}
            aria-label='Dislike'
            color='inherit'
            onClick={handleDislikeClick}
          >
            {
              look.disliked ? <DislikeSelected /> : <Dislike />
            }
          </IconButton>
        </CardActions>
      </div>
    </div>
  )
}

LookImage.propTypes = {
  image: PropTypes.string,
  onLike: PropTypes.func,
  onDislike: PropTypes.func,
}

LookImage.defaultProps = {
  image: '',
}

export default withStyles(styles)(LookImage)
