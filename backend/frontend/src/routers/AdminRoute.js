import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'

import CssBaseline from '@material-ui/core/CssBaseline'

import { loggedSelector, userSelector } from '../modules/user/selectors'

import AppBar from '../components/AppBar'
import Footer from '../components/Footer'
import Snackbar from '../components/Snackbar'

class AdminRoute extends PureComponent {
  render() {
    const {
      user,
      logged,
      openSnackbar,
      component: Component,
      ...rest
    } = this.props

    return (
      <Route
        {...rest}
        component={props => (
          logged && user.role === 'admin'? (
            <Fragment>
              <CssBaseline />
              <AppBar {...props} />
              <Component {...props} />
              <Snackbar />
              <Footer />
            </Fragment>
          ) : (
            <Redirect to='/'/>
          )
        )}
      />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  logged: loggedSelector(),
  user: userSelector()
})

export default connect(mapStateToProps)(AdminRoute)
