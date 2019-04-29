import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'

import { setSnackbar } from '../../modules/app/actions'

import {
  openSnackbarSelector,
  variantSnackbarSelector,
  messageSnackbarSelector,
} from '../../modules/app/selectors'

const CustomSnackbar = ({ classes, open, variant, message, setSnackbar }) => {

  const handleSnackbarClose = e => {
    const payload = {
      openSnackbar: false,
      variant: '',
      messageSnackbar: '',
    }
    setSnackbar(payload)
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      disableWindowBlurListener={true}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={handleSnackbarClose}
      ContentProps={{ 'aria-describedby': 'message-id' }}
    >
      <SnackbarContent
        className={classes[variant]}
        message={<span id='message-id'>{message}</span>}/>
    </Snackbar>
  )
}

const mapStateToProps = createStructuredSelector({
  open: openSnackbarSelector(),
  variant: variantSnackbarSelector(),
  message: messageSnackbarSelector(),
})

const mapDispatchToProps = dispatch => ({
  setSnackbar: payload => dispatch(setSnackbar(payload)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CustomSnackbar))
