import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Form, Field } from 'react-final-form'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'

import styles from './styles.js'

import {
  updateUser,
} from '../../modules/user/actions'

import { userSelector } from '../../modules/user/selectors'

const hairs = [
  { label: 'Preto', value: 'black' },
  { label: 'Castanho Escuro', value: 'darkBrown' },
  { label: 'Castanho Claro', value: 'lightBrown' },
  { label: 'Loiro', value: 'blonde' },
  { label: 'Ruivo', value: 'ginger' },
  { label: 'Grisalho', value: 'grey' },
  { label: 'Branco', value: 'white' },
  { label: 'Careca', value: 'bald' },
  { label: 'Outro', value: 'other' }
]

const skins = [
  { label: 'Negro', value: 'black' },
  { label: 'Pardo', value: 'brown' },
  { label: 'Branco', value: 'white' },
  { label: 'Amarelo', value: 'yellow' },
  { label: 'Bronzeado', value: 'tanned' },
  { label: 'Indígena', value: 'indian' },
  { label: 'Outro', value: 'other' }
]

const eyes = [
  { label: 'Verde', value: 'green' },
  { label: 'Azul', value: 'blue' },
  { label: 'Castanho Claro', value: 'lightBrown' },
  { label: 'Castanho', value: 'brown' },
  { label: 'Preto', value: 'black' },
  { label: 'Cinza', value: 'grey' },
  { label: 'Outro', value: 'other' }
]

class Profile extends  PureComponent  {

  onSubmit = data => {
    const { updateUser } = this.props
    updateUser({ appearence: data })
  }

  render() {
    const { user, classes } = this.props

    const picture = user.facebookPicture? user.facebookPicture.data.url : null

    return (
      <Form
        initialValues={user.appearence}
        onSubmit={this.onSubmit}
        subscription={{ submitting: true, pristine: true }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Typography className={classes.title} variant="h4" component="h3">
              Aparência
            </Typography>
            <Grid className={classes.contentRow} container spacing={24}>
              <Grid className={classes.contentRow} item xs={12}>
                <Field name="hairColor">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      select
                      label="Cabelo"
                      className={classes.textField}
                      fullWidth
                      margin="normal"
                    >
                      {hairs.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Field name="skinColor">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      select
                      label="Pele"
                      className={classes.textField}
                      fullWidth
                      margin="normal"
                    >
                      {skins.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Field name="eyeColor">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      select
                      label="Olhos"
                      className={classes.textField}
                      fullWidth
                      margin="normal"
                    >
                      {eyes.map(option => (
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Profile))
