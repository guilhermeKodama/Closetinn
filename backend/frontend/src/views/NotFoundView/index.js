import React from 'react'

import styles from './styles.js'

import NotFound from '../../components/NotFound'

import { withStyles } from '@material-ui/core/styles'

const NotFoundView = ({
  classes,
}) => (
  <main className={classes.root}>
    <NotFound />
  </main>
)

export default withStyles(styles)(NotFoundView)
