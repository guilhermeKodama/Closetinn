import React, { PureComponent } from 'react'
import { Route, Redirect } from 'react-router-dom'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'

import styles from './styles'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

class PublicRoute extends PureComponent {
  render() {
    const {
      classes,
      location: { pathname },
      logged,
      component: Component,
      ...rest
    } = this.props,
    signin = pathname === '/signin'
  
    return (
      <Route
        {...rest}
        component={props => (
          logged ?
            <Redirect to='/profile'/>
          : 
            <div className={classNames(classes.root, { [classes.background]: signin })}>
              {signin && <div className={classes.overlay} />}
              <Header/>
              <Component {...props}/>
              <Footer/>
            </div>
        )}
      />
    )
  }
}


export default withStyles(styles)(PublicRoute)
