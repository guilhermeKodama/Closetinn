import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import SwipeableViews from 'react-swipeable-views'

import { withStyles } from '@material-ui/core/styles'
import MobileStepper from '@material-ui/core/MobileStepper'
import Typography from '@material-ui/core/Typography'



class Slider extends PureComponent {

  componentDidMount() {
    const { interval } = this.props

    if (interval) {
      this.autoScroll(interval)
    }
  }

  componentWillUnmount(){
    clearInterval(this.intervalId)
  }

  autoScroll = interval => {
    this.intervalId = setInterval(() => {
      const { images, activeStep } = this.props

      if (activeStep === images.length - 1) {
        return this.handleStepChange(0)
      }

      this.handleStepChange(activeStep + 1)
    }, interval)
  }

  /**
   * Handle functions
   */

  handleStepChange = activeStep => {
    const { onStepChange } = this.props
    onStepChange(activeStep)
  }

  render() {
    const { classes, activeStep, images } = this.props

    return (
      <Fragment>
        <SwipeableViews
          className={classes.root}
          index={activeStep}
          onChangeIndex={this.handleStepChange}
          enableMouseEvents
        >
          {
            images.map(image => (
              <div
                key={image.url.x1}
                className={classes.imageWrapper}
              >
                <img
                  className={classes.image}
                  src={image.url.x1}
                  srcSet={`${image.url.x2} 2x, ${image.url.x3} 3x`}
                  alt={image.label}
                />
                <Typography
                  className={classes.label}
                  variant='display2'
                  color='inherit'
                  align='center'
                >
                  {image.label}
                </Typography>
              </div>
            ))
          }
        </SwipeableViews>
        <MobileStepper
          className={classes.stepper}
          classes={{
            dot: classes.dot,
            dotActive: classes.dotActive,
          }}
          steps={images.length}
          position='static'
          activeStep={activeStep}
        />
      </Fragment>
    )
  }
}

Slider.propTypes = {
  images: PropTypes.array.isRequired,
}

Slider.defaultProps = {
  images: [],
}

export default withStyles(styles)(Slider)
