import 'babel-polyfill'
import 'typeface-raleway'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Raven from 'raven-js'
import TagManager from 'react-gtm-module'

import './styles/index.css'

import config from './config'
import store from './store'

import AppRouter from './routers/AppRouter'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from "@material-ui/core/CssBaseline"

const tagManagerArgs = { gtmId: config.gtmId }
TagManager.initialize(tagManagerArgs)

Raven.config(config.sentryUrl, {
  environment: process.env.NODE_ENV || 'local',
  shouldSendCallback: () => {
    // Only send errors from development mode
    return process.env.NODE_ENV === 'production'
  }
}).install()

const theme = createMuiTheme({
  typography: {
    // Tell Material-UI what's the font-size on the html element is.
    htmlFontSize: 10,
    fontFamily: 'Raleway, sans-serif',
  },
  palette: {
    primary: {
      main: '#333333',
    },
    secondary: {
      main: '#388e3c',
    },
    type: 'light',
  }
})

const App = (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter/>
    </MuiThemeProvider>
  </Provider>
)

render(App, document.getElementById('root'))
