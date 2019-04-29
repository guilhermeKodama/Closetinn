import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const Banner = ({
  classes,
  className,
  background,
  label,
  buttonLabel,
  onClick
}) => {

  const handleClick = e => {
    onClick(e)
  }

  return (
    <div className={[classes.root, className].join(' ')}>
      <img
        className={classes.image}
        src={background.x1}
        srcSet={`${background.x2} 2x, ${background.x3} 3x`}
        alt={label}
      />
      <div className={classes.overlay}/>
      <div className={classes.wrapper}>
        <Typography
          className={classes.label}
          variant='display2'
        >
          {label}
        </Typography>
        <Button
          className={classes.button}
          variant='contained'
          size='large'
          color='primary'
          onClick={handleClick}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
}

Banner.propTypes = {
  background: PropTypes.object,
  label: PropTypes.string,
  buttonLabel: PropTypes.string,
  onClick: PropTypes.func,
}

Banner.defaultProps = {
  background: {},
  label: 'Label',
  buttonLabel: 'Button',
  onClick: () => {},
}

export default withStyles(styles)(Banner)
