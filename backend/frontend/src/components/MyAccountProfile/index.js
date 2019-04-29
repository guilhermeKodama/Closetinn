import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Form, Field } from 'react-final-form'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import styles from './styles.js'

import {
  updateUser,
} from '../../modules/user/actions'

import { userSelector } from '../../modules/user/selectors'

class Profile extends  PureComponent  {

  onSubmit = data => {
    const { updateUser } = this.props
    console.log('data:', data)
    updateUser(data)
  }

  render() {
    const { user, classes } = this.props

    const picture = user.facebookPicture? user.facebookPicture.data.url : null

    return (
      <Form
        initialValues={{ email: user.email, name: user.name }}
        onSubmit={this.onSubmit}
        subscription={{ submitting: true, pristine: true }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Grid className={classes.contentRow} container spacing={24}>
              <Grid className={classes.contentRow} item xs={12}>
                <Avatar alt="profile" src={picture} className={classes.profileImage} />
              </Grid>
              <Grid className={classes.contentRow} item xs={12} sm={6}>
                <Field name="email">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      label="Email"
                      fullWidth
                      placeholder="abc@exemplo.com"
                      className={classes.textField}
                      margin="normal"
                    />
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentRow} item xs={12} sm={6}>
                <Field name="name">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      label="Nome"
                      fullWidth
                      placeholder="Marcela da Silva"
                      className={classes.textField}
                      margin="normal"
                    />
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentRow} item xs={12} sm={6}>
                <Field name="newPassword">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      label="Nova Senha"
                      fullWidth
                      placeholder="Insira uma nova senha"
                      className={classes.textField}
                      margin="normal"
                    />
                  )}
                </Field>
              </Grid>
              <Grid className={classes.contentRow} item xs={12} sm={6}>
                <Field name="newPassword2">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      label="Nova Senha"
                      fullWidth
                      placeholder="Repita a nova senha"
                      className={classes.textField}
                      margin="normal"
                    />
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
