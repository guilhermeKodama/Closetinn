import React from 'react'

import { withStyles } from '@material-ui/core/styles'

import styles from './styles'

import ClosetinnCircle from '../Icons/ClosetinnCircle'

const Header = ({
  classes,
  width,
}) => (
  <header className={classes.root}>
    <ClosetinnCircle className={classes.closetinn}/>
  </header>
)

export default withStyles(styles)(Header)
