import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import SignInForm from '../../../forms/SignInForm'

import config from '../../../config'

import {
  signIn,
  signInFacebook,
} from '../../../modules/user/actions'

import {
  loggedSelector,
  userErrorSelector,
} from '../../../modules/user/selectors'

class SignInView extends Component {

  handleFacebookResponse = response => {
    const { signInFacebook } = this.props
    signInFacebook(response)
  }

  handleSignInClick = e => {
    e.preventDefault()
    const { signIn } = this.props
    signIn()
  }

  handleSignUpClick = () => {
    const { history } = this.props
    history.push('/signup')
  }

  handleSnackbarClose = e => {
    this.closeSnackbar()
  }

  closeSnackbar = () => {
    this.setState(() => ({ open: false }))
  }

  render() {
    const { classes, logged } = this.props
    console.log('AQUIIII')

    if (logged) return <Redirect to='/profile' />

    return (
      <main className={classes.root}>
        <Grid
          className={classes.grid}
          container
          justify='center'
          alignItems='center'
        >
          <Grid item>
            <div className={classes.content}>
              <Typography
                variant='subtitle1'
                paragraph
              >
                O CLOSET que você sempre <br/> sonhou so que na internet!
              </Typography>
              <FacebookLogin
                appId={config.facebookAppId}
                disableMobileRedirect={true}
                autoLoad={false}
                fields='name,email,picture'
                callback={this.handleFacebookResponse}
                render={renderProps => (
                  <Button
                    className={classes.facebookButton}
                    variant='contained'
                    fullWidth
                    color='primary'
                    onClick={renderProps.onClick}
                  >
                    Entrar com Facebook
                  </Button>
                )}
              />
              <Typography variant='subtitle1'>ou</Typography>
              <SignInForm onSubmit={this.handleSignInClick} />
              <Typography paragraph><Link className={classes.link} to={'/forgot'}> Esqueceu a senha? </Link></Typography>
              <Typography gutterBottom>Ainda não tem uma conta? </Typography>
              <Button
                className={classes.button}
                fullWidth
                variant='contained'
                color='primary'
                onClick={this.handleSignUpClick}
              >
                Criar conta
              </Button>
            </div>
          </Grid>
        </Grid>
      </main>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  logged: loggedSelector(),
  error: userErrorSelector(),
})

const mapDispatchToProps = dispatch => ({
  signInFacebook: response => dispatch(signInFacebook(response)),
  signIn: () => dispatch(signIn()),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SignInView))
