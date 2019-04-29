import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import styles from './styles'

import ProfileLogged from '../../styles/icons/profile-logged-icon.svg'

import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

import ProfileMenuList from '../../components/ProfileMenuList'

import { logout } from '../../modules/user/actions'

import {
  loggedSelector,
  nameSelector,
} from '../../modules/user/selectors'

class AppBarCustom extends PureComponent {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
    this.handleMobileMenuClose()
  }

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget })
  }

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null })
  }

  render () {
    const { anchorEl } = this.state
    const { classes, logged, logout } = this.props
    const isMenuOpen = Boolean(anchorEl)
    // const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    return (
      <Fragment>
        <AppBar className={classes.appBar} position='sticky'>
          <Toolbar className={classes.toolbar} disableGutters>
            <Typography
              className={classes.title}
              variant='title'
              color='inherit'
            >
              closetinn
            </Typography>
            <div className={classes.spacer}/>
            {
              logged ?
              <Fragment>
                <Avatar
                  onClick={this.handleProfileMenuOpen}
                  className={classes.avatar}
                  color='inherit'
                  aria-label='Profile'
                >
                  <ProfileLogged/>
                </Avatar>
              </Fragment>
              : <Typography
                  className={classes.profileTitle}
                  color='inherit'
                >
                  {`Entrar`}
                </Typography>
            }
          </Toolbar>
        </AppBar>
        {<ProfileMenuList logout={logout} anchorEl={anchorEl} open={isMenuOpen} onClose={this.handleMenuClose} />}
      </Fragment>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  logged: loggedSelector(),
  name: nameSelector(),
})

const mapDispatchToProps = dispatch => ({
  logout: payload => dispatch(logout(payload)),
})

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AppBarCustom)))
