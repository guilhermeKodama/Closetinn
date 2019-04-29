import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import styles from './styles.js'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

import { Form, Field } from 'react-final-form'

import { loadingSelector } from '../../../modules/app/selectors'

import { getMe, unsubscribe } from '../../../modules/user/actions'

import { userSelector } from '../../../modules/user/selectors'

import { click, EVENT } from '../../../utils/atena'

class UnsubscribeView extends Component {
  componentDidMount() {
    const {
      getMe,
      location: { pathname, search },
    } = this.props

    const params = new URLSearchParams(search)
    const token = params.get('token')

    if (token) {
      getMe({ token, nextRoute: pathname })
    }
  }

  onSubmit = data => {
    const { unsubscribe, user, location: { pathname } } = this.props
    click(user._id, null, null, EVENT.UNSUBSCRIBE_CLICK, pathname)
    unsubscribe({ ...data })
  }

  render() {
    const { classes } = this.props

    return (
      <main className={classes.root}>
        <Form
          onSubmit={this.onSubmit}
          subscription={{ submitting: true, pristine: true }}
          render={({ handleSubmit }) => (
            <Grid container spacing={24}>
              <form className={classes.form} onSubmit={handleSubmit}>
                <Grid className={classes.gridItem} item xs={12}>
                  <FormControl required error={null} component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">Por que você deseja deseja ir embora? :(</FormLabel>
                    <FormGroup>
                    <Field name="reasons" type="checkbox" value="Não cumpre o que promete">
                      {({ input, meta }) => (
                        <FormControlLabel
                          control={
                            <Checkbox {...input} />
                          }
                          label="Não cumpre o que promete"
                        />
                      )}
                      </Field>
                      <Field name="reasons" type="checkbox" value="Não gostei das recomendações">
                        {({ input, meta }) => (
                          <FormControlLabel
                            control={
                              <Checkbox {...input} />
                            }
                            label="Não gostei das recomendações"
                          />
                        )}
                      </Field>
                      <Field name="reasons" type="checkbox" value="Eu esperava outra coisa do serviço">
                        {({ input, meta }) => (
                          <FormControlLabel
                            control={
                              <Checkbox {...input}/>
                            }
                            label="Eu esperava outra coisa do serviço"
                          />
                        )}
                      </Field>
                      <Field name="reasons" type="checkbox" value="Muitos emails">
                        {({ input, meta }) => (
                          <FormControlLabel
                            control={
                              <Checkbox {...input}/>
                            }
                            label="Muitos emails"
                          />
                        )}
                      </Field>
                      <Field name="reasons" type="checkbox" value="Não estou mais interessado">
                        {({ input, meta }) => (
                          <FormControlLabel
                            control={
                              <Checkbox {...input}/>
                            }
                            label="Não estou mais interessado"
                          />
                        )}
                      </Field>
                      <Field name="reasons" type="checkbox" value="Eu não me lembro de ter me cadastrado">
                        {({ input, meta }) => (
                          <FormControlLabel
                            control={
                              <Checkbox {...input}/>
                            }
                            label="Eu não me lembro de ter me cadastrado"
                          />
                        )}
                      </Field>
                      </FormGroup>
                      <Field name="suggestion" type="text">
                        {({ input, meta }) => (
                          <TextField
                            {...input}
                            label="Sugestão"
                            multiline
                            rows="4"
                            placeholder="Por favor deixe aqui sua sugestão de como podemos melhorar."
                            className={classes.textField}
                            margin="normal"
                          />
                        )}
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid className={classes.gridItem} item xs={12}>
                    <Button className={classes.submit} type="submit" size="large" variant="contained" color="primary">
                      Parar de receber emails :(
                    </Button>
                  </Grid>
                </form>
              </Grid>
            )}
          />
      </main>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  user: userSelector(),
  loading: loadingSelector()
})

const mapDispatchToProps = dispatch => ({
  unsubscribe: payload => dispatch(unsubscribe(payload)),
  getMe: payload => dispatch(getMe(payload)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UnsubscribeView))
