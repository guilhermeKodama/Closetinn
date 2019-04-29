import React, { PureComponent } from 'react'
import classNames from 'classnames'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'

class Main extends PureComponent {
  render() {
    const {
      classes,
      className,
      width,
      toolbar = false,
      children,
    } = this.props
    
    return (
      <main className={classNames(classes.root, className)}>
        { toolbar && <div className={classes.toolbar} />}
        {children}
      </main>
    )
  }
}

export default withWidth()(withStyles(styles)(Main))
