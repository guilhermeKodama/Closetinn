import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Form, Field } from 'react-final-form'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Radio from '@material-ui/core/Radio'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import styles from './styles.js'

import {
  updateUser,
} from '../../modules/user/actions'

import { userSelector } from '../../modules/user/selectors'

class Recommendations extends  PureComponent  {

  onSubmit = data => {
    const { updateUser } = this.props
    updateUser({ recommendations: data })
  }

  render() {
    const { classes, user } = this.props

    return (
      <Form
        initialValues={user.recommendations}
        onSubmit={this.onSubmit}
        subscription={{ submitting: true, pristine: true }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Typography className={classes.title} variant="h4" component="h3">
              Recommendações
            </Typography>
            <Grid className={classes.contentRow} container spacing={24}>
              <Grid className={classes.contentColumn} item xs={12}>
                <FormLabel component="legend">Frequência</FormLabel>
                <Field name="frequency" component="input" type="radio" value="1">
                  {({ input, meta }) => (
                    <FormControlLabel {...input} control={<Radio />} label="1 por mês" />
                  )}
                </Field>
                <Field name="frequency" component="input" type="radio" value="2">
                  {({ input, meta }) => (
                    <FormControlLabel {...input} control={<Radio />} label="2 por mês" />
                  )}
                </Field>
                <Field name="frequency" component="input" type="radio" value="3">
                  {({ input, meta }) => (
                    <FormControlLabel {...input} control={<Radio />} label="3 por mês" />
                  )}
                </Field>
                <Field name="frequency" component="input" type="radio" value="4">
                  {({ input, meta }) => (
                    <FormControlLabel {...input} control={<Radio />} label="4 por mês" />
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentColumn} item xs={12}>
                <FormLabel component="legend">Tipo</FormLabel>
                <Field name="type" component="input" type="checkbox" value="looks">
                  {({ input, meta }) => (
                    <FormControlLabel {...input} control={<Checkbox />} label="Recomendação de looks" />
                  )}
                </Field>
                <Field name="type" component="input" type="checkbox" value="promotions">
                  {({ input, meta }) => (
                    <FormControlLabel {...input} control={<Checkbox />} label="Recomendação de promoções" />
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Button className={classes.submit} type="submit" size="large" variant="contained" color="primary">
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  user: userSelector(),
})

const mapDispatchToProps = dispatch => ({
  updateUser: (data) => dispatch(updateUser(data)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Recommendations))
