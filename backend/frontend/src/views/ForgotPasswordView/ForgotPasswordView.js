import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormControl } from 'react-bootstrap'
import styles from './ForgotPasswordView.scss'

import CustomAlert from '../../components/CustomAlert'

import _ from 'lodash'

import { forgotPassword } from  '../../actions/actionCreators'

class ForgotPasswordView extends Component {

  state = {
    email: null,
    alertVisible: false,
    alertMessage: null,
    alertType: null,
    error: null
  }

  componentWillReceiveProps(newProps) {
    /* Error Handling */
    const { sendForgotPasswordEmail, error } = newProps.user

    if(sendForgotPasswordEmail && _.isNil(error)) {
      this.setState({
        alertVisible: true,
        alertMessage: 'Email enviado com sucesso!',
        alertType: 'success',
        error: null
      })
    } else if(!_.isNil(error)) {
      this.setState({
        alertVisible: true,
        alertMessage: 'Email não cadastrado!',
        alertType: 'danger',
        error: error
      })
    }
  }

  handleAlertDismiss = () => {
    this.setState({
      alertVisible: false
    })
  }

  handleChangeInputEmail = e => {
    this.setState({ email: e.target.value })
  }

  onClickValidateAndSendEmail = e => {
    this.props.forgotPassword({
      email: this.state.email
    })
  }

  render() {
    return (
      <div className={styles.ForgotPasswordView}>
        <div className={styles.content}>
          {
            this.state.alertVisible &&
            <CustomAlert message={this.state.alertMessage} type={this.state.alertType} handleAlertDismiss={this.handleAlertDismiss} />
          }
          <div className={styles.containerElement}>
            <h4> Insira seu email e te enviaremos um link para alterar sua senha ;) </h4>
          </div>
          <div className={styles.containerElement}>
            <FormControl bsClass={styles.inputText} type="text" placeholder="Email" value={this.state.email} onChange={this.handleChangeInputEmail}/>
          </div>
          <div className={styles.containerElement}>
            <button className={styles.button} onClick={this.onClickValidateAndSendEmail}>Enviar</button>
          </div>
        </div>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  forgotPassword: (email) => dispatch(forgotPassword(email)),
})

export default connect(undefined, mapDispatchToProps)(ForgotPasswordView)
