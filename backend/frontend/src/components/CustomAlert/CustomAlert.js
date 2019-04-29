import React, { Component } from 'react'
import styles from './CustomAlert.css'
import { Alert } from 'react-bootstrap'
import _ from 'lodash'

export default class CustomAlert extends Component {

  render() {
    const { message, handleAlertDismiss, type } = this.props
    const alertType = _.isEmpty(type)? 'danger' : type

    return (
      <div className={styles.alertContainer}>
        <Alert bsStyle={alertType} onDismiss={handleAlertDismiss}>
          <h4>{alertType === 'danger'? 'Error!' : 'Sucesso!'}</h4>
          <p>{message}</p>
        </Alert>
      </div>
    )
  }
}
