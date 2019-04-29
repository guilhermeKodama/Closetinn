import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'

import {
  isValid,
  getFormValues,
} from 'redux-form'

import { updateCart } from '../../actions/cart'
import { createPurchaseOrder } from '../../actions/purchaseOrder'
import { getAddressByPostcode } from '../../actions/checkout'

import CartView from '../../views/CartView'
import AddressCard from '../../components/AddressCard'
import PaymentMethodCard from '../../components/PaymentMethodCard'
import ThankYouMessage from '../../components/ThankYouMessage'

const STEP = {
  ADDRESS_AND_PAYMENT: 0,
  REVIEW: 1,
  DONE: 2
}

class Checkout extends PureComponent {
  state = {
    steps: ['Endereço e Pagamento', 'Revisão do pedido', 'Pedido realizado'],
    activeStep: STEP.ADDRESS_AND_PAYMENT,
  }

  handleNext = () => {
    const { history, createPurchaseOrder, updateCart, addressFormValues, paymentMethodFormValues, cart  } = this.props,
          { activeStep } = this.state

    if(activeStep === STEP.ADDRESS_AND_PAYMENT) {
      updateCart({ address: addressFormValues, creditCard: paymentMethodFormValues })
    }

    if(activeStep === STEP.REVIEW) {
      createPurchaseOrder(cart._id)
    }

    if(activeStep === STEP.DONE) {
      history.push('/myOrders')
    }

    this.setState(prevState => ({ activeStep: prevState.activeStep + 1, }))
  }

  handleBack = () => {
    this.setState(prevState => ({ activeStep: prevState.activeStep - 1, }))
  }

  handlePostcodeChange = e => {
    const postcode = e.target.value
    if (postcode.length === 8) {
      const { getAddressByPostcode } = this.props
      getAddressByPostcode(postcode)
    }
  }

  getStepContent = step => {
    const { cart } = this.props

    switch (step) {
      case STEP.ADDRESS_AND_PAYMENT:
        return (
          <Fragment>
            <AddressCard
              readOnly={false}
              onPostcodeChange={this.handlePostcodeChange}
            />
            <PaymentMethodCard readOnly={false} />
          </Fragment>
        )
      case STEP.REVIEW:
        return (
          <Fragment>
            <CartView readOnly />
            <AddressCard address={cart.address} readOnly />
            <PaymentMethodCard creditCard={cart.creditCard} readOnly />
          </Fragment>
        )
      case STEP.DONE: return <ThankYouMessage />
      default: return null
    }
  }

  getButtonLabel = step => {
    switch (step) {
      case STEP.ADDRESS_AND_PAYMENT: return 'Salvar'
      case STEP.REVIEW: return 'Finalizar pedido'
      case STEP.DONE: return 'Meus Pedidos'
      default: return 'Proximo'
    }
  }

  renderStep = (activeStep, nextStep) => (step, index) => {
    const { classes } = this.props,
          { activeStep } = this.state

    return (
      <Step key={step}>
        <StepLabel>{step}</StepLabel>
        <StepContent>
          { this.getStepContent(index) }
          <Fragment>
            <Button
              className={classes.button}
              disabled={activeStep === STEP.ADDRESS_AND_PAYMENT || activeStep === STEP.DONE}
              onClick={this.handleBack}
            >
              Voltar
            </Button>
            <Button
              className={classes.button}
              disabled={!nextStep}
              variant='contained'
              color='primary'
              onClick={this.handleNext}
            >
              {this.getButtonLabel(activeStep)}
            </Button>
          </Fragment>
        </StepContent>
      </Step>
    )
  }

  render() {
    const { classes, addressFormIsValid, paymentMethodFormIsValid } = this.props,
          { steps, activeStep } = this.state
    let nextStep = true

    if (activeStep === 0) {
      nextStep = (addressFormIsValid && paymentMethodFormIsValid)
    }

    return (
      <main className={classes.root}>
        <Grid className={classes.grid} container>
          <Grid item xs>
            <Stepper
              className={classes.stepper}
              activeStep={activeStep}
              orientation='vertical'
            >
              { steps.map(this.renderStep(activeStep, nextStep)) }
            </Stepper>
          </Grid>
        </Grid>
      </main>
    )
  }
}

const mapStateToProps = state => ({
  cart: state.user.data.cart,
  addressFormValues: getFormValues('AddressForm')(state),
  addressFormIsValid: isValid('AddressForm')(state),
  paymentMethodFormValues: getFormValues('CreditCardForm')(state),
  paymentMethodFormIsValid: isValid('CreditCardForm')(state),
})

const mapDispatchToProps = dispatch => ({
  updateCart: data => dispatch(updateCart(data)),
  createPurchaseOrder: cartId => dispatch(createPurchaseOrder(cartId)),
  getAddressByPostcode: postcode => dispatch(getAddressByPostcode(postcode)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Checkout))
