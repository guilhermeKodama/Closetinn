import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, FormControl } from 'react-bootstrap'
import styles from './ResetPasswordView.scss'

import CustomAlert from '../../components/CustomAlert'

import _ from 'lodash'

import {
  isForgotPasswordTokenValid,
  resetPassword,
} from '../../actions/actionCreators'

class ForgotPasswordView extends Component {

  state = {
    newPassword: null,
    newPasswordRepeat: null,
    alertVisible: false,
    alertMessage: null,
    alertType: null,
    error: null
  }

  componentDidMount() {
    const { params: { token } } = this.props.match

    this.props.isForgotPasswordTokenValid({ token })
  }

  componentWillReceiveProps(newProps) {
    /* Error Handling */
    const { user: { error, resetPasswordSuccess } } = newProps

    if(resetPasswordSuccess) {
      this.setState({
        alertVisible: true,
        alertMessage: 'Senha atualizada com sucesso!',
        alertType: 'success',
        error: error
      })
    } else if(!resetPasswordSuccess && !_.isNil(error)) {
      this.setState({
        alertVisible: true,
        alertMessage: 'Token invalido para alterar a senha, tente novamente!',
        alertType: 'danger',
        error: error
      })
    } else if(!_.isNil(error)) {
      this.setState({
        alertVisible: true,
        alertMessage: 'Token não é valido, tente novamente!',
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

  handleChangeInputNewPassword = e => {
    this.setState({ newPassword: e.target.value })
  }

  handleChangeInputNewPasswordRepeat = e => {
    this.setState({ newPasswordRepeat: e.target.value })
  }


  onClickResetPassword = e => {
    const { user: { emailValidResetPasswordToken } } = this.props
    const { params: { token } } = this.props.match

    this.props.resetPassword(
      emailValidResetPasswordToken,
      {
        newPassword: this.state.newPassword,
        token
      })
  }

  render() {
    const { user: { resetPasswordTokenIsValid } } = this.props

    if(resetPasswordTokenIsValid) {
      return (
        <div className={styles.ForgotPasswordView}>
          {
            this.state.alertVisible &&
            <CustomAlert message={this.state.alertMessage} type={this.state.alertType} handleAlertDismiss={this.handleAlertDismiss} />
          }
          <div className={styles.containerElement}>
            <h4> Insira seu novo password. </h4>
          </div>
          <div className={styles.containerElement}>
            <FormControl bsClass={styles.inputText} type="password" placeholder="Nova senha" value={this.state.newPassword} onChange={this.handleChangeInputNewPassword}/>
          </div>
          <div className={styles.containerElement}>
            <FormControl bsClass={styles.inputText} type="password" placeholder="Repetir nova senha" value={this.state.newPasswordRepeat} onChange={this.handleChangeInputNewPasswordRepeat}/>
          </div>
          <div className={styles.containerElement}>
            <Button onClick={this.onClickResetPassword} bsClass={styles.primaryButton} bsSize="large">Enviar</Button>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.ForgotPasswordView}>
        {
          this.state.alertVisible &&
          <CustomAlert message={this.state.alertMessage} type={this.state.alertType} handleAlertDismiss={this.handleAlertDismiss} />
        }
        {
          !this.state.alertVisible &&
          <div className={styles.containerElement}>
            <h4> Verificando token... </h4>
          </div>
        }
      </div>
    )

  }

}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => ({
  isForgotPasswordTokenValid: (token) => dispatch(isForgotPasswordTokenValid(token)),
  resetPassword: (token, data) => dispatch(resetPassword(token, data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordView)
