import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'

import { loggedSelector } from '../../modules/user/selectors'

import AppBar from '../../components/AppBar'
import Footer from '../../components/Footer'
import Snackbar from '../../components/Snackbar'

const PrivateRoute = ({
  logged,
  openSnackbar,
  onDrawerToggle,
  onFilterToggle,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    component={props => (
      logged ? (
        <Fragment>
          <AppBar {...props} />
          <Component {...props} />
          <Snackbar />
          <Footer />
        </Fragment>
      ) : (
        <Redirect to='/signin'/>
      )
    )}
  />
)

const mapStateToProps = createStructuredSelector({
  logged: loggedSelector(),
})

export default connect(mapStateToProps)(PrivateRoute)
