import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import FacebookLogin from 'react-facebook-login'
import { Button, FormGroup, FormControl } from 'react-bootstrap'
import styles from './SignUpView.scss'

import config from '../../config'

import CustomAlert from '../../components/CustomAlert'

import { isValidName, isValidEmail, isValidPassword, isValidPasswordConfirmation } from '../../utils/common'

import { signUp, signInFacebook, } from '../../actions/user'

class SignUpView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name: null,
      email: null,
      password: null,
      passwordConfirmation: null,
      alertVisible: false,
      alertMessage: null,
      error: null
    }

    const { user: { data: { logged } } } = this.props
    if (logged) this.props.history.push('/profile')
  }

  componentWillReceiveProps(newProps) {
    if(newProps.user.data.logged) return this.props.history.push('/profile')

    /* Error Handling */
    const error = newProps.user.data.error
    if(error) {
      if(error === 'Conflict') {
        this.setState({
          alertVisible: true,
          alertMessage: 'Usuário já existe!',
          error
        })
      } else {
        this.setState({
          alertVisible: true,
          alertMessage: 'Um erro ocorreu, tente novamente mais tarde.',
          error
        })
      }
    }
  }

  handleAlertDismiss() {
    this.setState({
      alertVisible: false
    })
  }

  handleChangeInputName = e => {
    this.setState({ name: e.target.value })
  }

  handleChangeInputEmail = e => {
    this.setState({ email: e.target.value })
  }

  handleChangeInputPassword = e => {
    this.setState({ password: e.target.value })
  }

  handleChangeInputPasswordConf = e => {
    this.setState({ passwordConfirmation: e.target.value })
  }

  handleFacebookResponse = (response) => {
    this.props.signInFacebook(response)
  }

  onClickSignUp = () => {
    const { name, email, password, passwordConfirmation } = this.state

    if (isValidName(name) &&
        isValidEmail(email) &&
        isValidPassword(password) &&
        isValidPasswordConfirmation(password, passwordConfirmation)) {

        this.props.signUp({
          name: name,
          email: email,
          password: password
        })
    } else {
      this.setState({
        alertVisible: true,
        alertMessage: 'Campos inválidos. Por favor, preencha corretamente.',
        error: 'Erro!'
      })
    }
  }

  /* Fields validation */

  getNameValidationState = () => {
    const { name } = this.state

    if (name === null) return null
    else if (isValidName(name)) return 'success'
    return 'error'
  }

  getEmailValidationState = () => {
    const { email } = this.state

    if (email === null) return null
    else if (isValidEmail(email)) return 'success'
    return 'error'
  }

  getPasswordValidationState = () => {
    const { password } = this.state

    if (password === null) return null
    else if (isValidPassword(password)) return 'success'
    return 'error'
  }

  getPasswordConfirmationValidationState = () => {
    const { password, passwordConfirmation } = this.state

    if (passwordConfirmation === null) return null
    else if (isValidPasswordConfirmation(password, passwordConfirmation)) return 'success'
    return 'error'
  }

  render() {
    return (
      <div className={styles.SignUpView}>
        {
          (this.state.error && this.state.alertVisible) &&
          <CustomAlert message={this.state.alertMessage} handleAlertDismiss={this.handleAlertDismiss} />
        }
        <div className={styles.text}>
          <span>Crie um Closetinn para<br/> dar só close certo ;)</span>
        </div>
        <div className={styles.form}>
          <form>
            <FormGroup className={styles.formGroup} validationState={this.getNameValidationState()}>
              <FormControl type="text" placeholder="Seu nome" value={this.state.name} onChange={this.handleChangeInputName} />
            </FormGroup>
            <FormGroup className={styles.formGroup} validationState={this.getEmailValidationState()}>
              <FormControl type="email" placeholder="E-mail" value={this.state.email} onChange={this.handleChangeInputEmail} />
            </FormGroup>
            <FormGroup className={styles.formGroup} validationState={this.getPasswordValidationState()}>
              <FormControl type="password" placeholder="Senha" value={this.state.password} onChange={this.handleChangeInputPassword}/>
            </FormGroup>
            <FormGroup className={styles.formGroup} validationState={this.getPasswordConfirmationValidationState()}>
              <FormControl type="password" placeholder="Senha de novo" value={this.state.passwordConfirmation} onChange={this.handleChangeInputPasswordConf}/>
            </FormGroup>
            <Button className={styles.button} onClick={this.onClickSignUp}>Entrar</Button>
          </form>
          <div className={styles.text}>
            <span>ou</span>
          </div>
          <FacebookLogin
            appId={config.facebookAppId}
            disableMobileRedirect={true}
            cssClass={styles.facebookButton}
            autoLoad={false}
            fields="name,email,picture"
            callback={this.handleFacebookResponse} />
          <div className={styles.text}>
            <span>Já tem cadastro? <br/> <Link className={styles.link} to={'/signin'} >clique aqui para fazer login</Link></span>
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  signInFacebook: response => dispatch(signInFacebook(response)),
  signUp: (data) => dispatch(signUp(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpView)
