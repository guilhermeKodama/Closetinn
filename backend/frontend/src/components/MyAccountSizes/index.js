import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Form, Field } from 'react-final-form'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'

import styles from './styles.js'

import {
  updateUser,
} from '../../modules/user/actions'

import { userSelector } from '../../modules/user/selectors'

/*
 - casacos & jaquetas
 - agasalhos & sweaters
 - camisas
 - camisetas & polos
 - calça
 - bermudas & shorts
 - calçados
 */


const coatsJackets = [
  { label: 'PP', value: 'PP' },
  { label: 'P', value: 'P' },
  { label: 'M', value: 'M' },
  { label: 'G', value: 'G' },
  { label: 'GG', value: 'GG' },
  { label: 'XGG', value: 'XGG' }
]
const sweaters = [
  { label: 'PP', value: 'PP' },
  { label: 'P', value: 'P' },
  { label: 'M', value: 'M' },
  { label: 'G', value: 'G' },
  { label: 'GG', value: 'GG' },
  { label: 'XGG', value: 'XGG' }
]
const shirts = [
  { label: 'PP', value: 'PP' },
  { label: 'P', value: 'P' },
  { label: 'M', value: 'M' },
  { label: 'G', value: 'G' },
  { label: 'GG', value: 'GG' },
  { label: 'XGG', value: 'XGG' }
]
const tshirtsPolos = [
  { label: 'PP', value: 'PP' },
  { label: 'P', value: 'P' },
  { label: 'M', value: 'M' },
  { label: 'G', value: 'G' },
  { label: 'GG', value: 'GG' },
  { label: 'XGG', value: 'XGG' }
]
const pants = [
  { label: '34', value: '34' },
  { label: '36', value: '36' },
  { label: '38', value: '38' },
  { label: '40', value: '40' },
  { label: '42', value: '42' },
  { label: '44', value: '44' },
  { label: '46', value: '46' },
  { label: '48', value: '48' }
]
const shorts = [
  { label: '34', value: '34' },
  { label: '36', value: '36' },
  { label: '38', value: '38' },
  { label: '40', value: '40' },
  { label: '42', value: '42' },
  { label: '44', value: '44' },
  { label: '46', value: '46' },
  { label: '48', value: '48' }
]
const shoes = [
  { label: '34', value: '34' },
  { label: '36', value: '36' },
  { label: '38', value: '38' },
  { label: '40', value: '40' },
  { label: '42', value: '42' },
  { label: '44', value: '44' },
  { label: '46', value: '46' },
  { label: '48', value: '48' }
]

class MyAccountSizes extends  PureComponent  {

  onSubmit = data => {
    const { updateUser } = this.props
    updateUser({ sizes: data })
  }

  render() {
    const { user, classes } = this.props

    return (
      <Form
        initialValues={user.sizes}
        onSubmit={this.onSubmit}
        subscription={{ submitting: true, pristine: true }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Typography className={classes.title} variant="h4" component="h3">
              Tamanhos
            </Typography>
            <Grid className={classes.contentRow} container spacing={24}>
              <Grid className={classes.contentRow} item xs={12}>
                <Field name="coatsJackets">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      select
                      label="Casacos & Jaquetas"
                      className={classes.textField}
                      fullWidth
                      margin="normal"
                    >
                      {coatsJackets.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Field name="sweaters">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      select
                      label="Agasalhos & Sweaters"
                      className={classes.textField}
                      fullWidth
                      margin="normal"
                    >
                      {sweaters.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Field name="shirts">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      select
                      label="Camisas"
                      className={classes.textField}
                      fullWidth
                      margin="normal"
                    >
                      {shirts.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Field name="tshirtsPolos">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      select
                      label="Camisetas & Polos"
                      className={classes.textField}
                      fullWidth
                      margin="normal"
                    >
                      {tshirtsPolos.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Field name="pants">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      select
                      label="Calça"
                      className={classes.textField}
                      fullWidth
                      margin="normal"
                    >
                      {pants.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Field name="shorts">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      select
                      label="Bermudas & Shorts"
                      className={classes.textField}
                      fullWidth
                      margin="normal"
                    >
                      {shorts.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Field name="shoes">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      select
                      label="Calçados"
                      className={classes.textField}
                      fullWidth
                      margin="normal"
                    >
                      {shoes.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MyAccountSizes))
