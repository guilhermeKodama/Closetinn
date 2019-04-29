import React from 'react'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const NotFound = ({
  classes,
  className,
}) => (
  <div className={[classes.root, className].join(' ')}>
    <Typography
      className={classes.title}
      variant='display2'
    >
      Not Found! <span role='img' aria-label='sad face'>&#x1F610;</span>
    </Typography>
  </div>
)

export default withStyles(styles)(NotFound)
