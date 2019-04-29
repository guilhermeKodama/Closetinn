import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { numeral } from '../../utils/common'

const PromotionCard = ({
  classes,
  className,
  index,
  promotion,
  promotion: { biggestDiscountCloth },
  onClick,
}) => {

  /**
   * Handle functions
   */

  const handleClick = e => {
    onClick(e, index)
  }

  const handleShowProductsClick = e => {
    e.stopPropagation()
    onClick(e, index)
  }

  return (
    <Card className={[classes.root, className].join(' ')} onClick={handleClick}>
      <Card className={classes.card}>
        <Typography
          className={classes.topLabel}
          variant='subheading'
          align='center'
          >
            {`${numeral(promotion.biggestDiscount).format('0%')}`}<br/>OFF
          </Typography>
      </Card>
      <CardMedia
        className={classes.cardMedia}
        classes={{ root: classes.media }}
        image={biggestDiscountCloth.image_medium_url || biggestDiscountCloth.images_urls[0] || ''}
        src='img'
        title={promotion.category}
      />
      <CardContent className={classes.cardContent}>
        <Typography
          className={classes.title}
          variant='title'
          align='center'
          noWrap
        >
          {promotion.category}
        </Typography>
        <Typography align='center'>{`Preços a partir de ${numeral(promotion.lowestPrice).format()}`}</Typography>
      </CardContent>
      <CardActions
        className={classes.cardActions}
        disableActionSpacing
      >
        <Button
          size='small'
          color='primary'
          variant='contained'
          onClick={handleShowProductsClick}
        >
        Ver produtos
        </Button>
      </CardActions>
    </Card>
  )
}

PromotionCard.propTypes = {
  topLabel: PropTypes.element,
  coverUrl: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onClick: PropTypes.func,
}

PromotionCard.defaultProps = {
  topLabel: <div>80%<br/>OFF</div>,
  coverUrl: 'https://t-static.dafiti.com.br/8bMlWMJ7U4PwAgXByNJHO3ptJXY=/fit-in/430x623/dafitistatic-a.akamaihd.net%2fp%2fdzarm-cal%c3%a7a-jeans-dzarm-skinny-berlin-azul-3717-4383243-1-zoom.jpg',
  title: 'Leggings',
  subtitle: 'Peças a partir de R$ 29,99',
  onClick: () => {},
}

export default withStyles(styles)(PromotionCard)
