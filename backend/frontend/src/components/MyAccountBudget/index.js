import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Form, Field } from 'react-final-form'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/lab/Slider'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import styles from './styles.js'

import {
  updateUser,
} from '../../modules/user/actions'

import { userSelector } from '../../modules/user/selectors'

class Profile extends  PureComponent  {

  update = ([name, value], state, { changeValue }) => {
    changeValue(state, name, v => value)
  }

  onSubmit = data => {
    const { updateUser } = this.props
    updateUser({ budget: data })
  }

  render() {
    const { classes, user } = this.props

    return (
      <Form
        initialValues={user.budget}
        onSubmit={this.onSubmit}
        mutators={{ update: this.update }}
        subscription={{ submitting: true, pristine: true }}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <Typography className={classes.title} variant="h4" component="h3">
              Orçamento
            </Typography>
            <Grid className={classes.contentRow} container spacing={24}>
              <Grid className={classes.contentRow} item xs={12}>
                <Grid className={classes.labelContainer} item xs={8}>
                  <Typography id="label">Casacos e Jaquetas</Typography>
                </Grid>
                <Grid className={classes.sliderContainer} item xs={8}>
                  <Field name="coats&jackets">
                    {({ input, meta }) => (
                      <Slider
                        {...input}
                        min={0.0}
                        max={1000.0}
                        step={1.0}
                        onChange={(e, value) => form.mutators.update('coats&jackets', value)}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid className={classes.valueContainer} item xs={8}>
                  <Typography className={classes.title} variant="h6" component="h3">
                    <Field name="coats&jackets">
                      {({ input, meta }) => (
                        'R$ ' + (input.value || 0.00)
                      )}
                    </Field>
                  </Typography>
                </Grid>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Grid className={classes.labelContainer} item xs={8}>
                  <Typography id="label">Agasalhos e Sweaters</Typography>
                </Grid>
                <Grid className={classes.sliderContainer} item xs={8}>
                  <Field name="sweaters">
                    {({ input, meta }) => (
                      <Slider
                        {...input}
                        min={0}
                        max={1000}
                        step={1}
                        onChange={(e, value) => form.mutators.update('sweaters', value)}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid className={classes.valueContainer} item xs={8}>
                  <Typography className={classes.title} variant="h6" component="h3">
                    <Field name="sweaters">
                      {({ input, meta }) => (
                        'R$ ' + (input.value || 0.00)
                      )}
                    </Field>
                  </Typography>
                </Grid>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Grid className={classes.labelContainer} item xs={8}>
                  <Typography id="label">Camisas</Typography>
                </Grid>
                <Grid className={classes.sliderContainer} item xs={8}>
                  <Field name="shirts">
                    {({ input, meta }) => (
                      <Slider
                        {...input}
                        min={0}
                        max={1000}
                        step={1}
                        onChange={(e, value) => form.mutators.update('shirts', value)}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid className={classes.valueContainer} item xs={8}>
                  <Typography className={classes.title} variant="h6" component="h3">
                    <Field name="shirts">
                      {({ input, meta }) => (
                        'R$ ' + (input.value || 0.00)
                      )}
                    </Field>
                  </Typography>
                </Grid>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Grid className={classes.labelContainer} item xs={8}>
                  <Typography id="label">Camisetas & Polos</Typography>
                </Grid>
                <Grid className={classes.sliderContainer} item xs={8}>
                  <Field name="tshirts&polos">
                    {({ input, meta }) => (
                      <Slider
                        {...input}
                        min={0}
                        max={1000}
                        step={1}
                        onChange={(e, value) => form.mutators.update('tshirts&polos', value)}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid className={classes.valueContainer} item xs={8}>
                  <Typography className={classes.title} variant="h6" component="h3">
                    <Field name="tshirts&polos">
                      {({ input, meta }) => (
                        'R$ ' + (input.value || 0.00)
                      )}
                    </Field>
                  </Typography>
                </Grid>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Grid className={classes.labelContainer} item xs={8}>
                  <Typography id="label">Calça</Typography>
                </Grid>
                <Grid className={classes.sliderContainer} item xs={8}>
                  <Field name="pants">
                    {({ input, meta }) => (
                      <Slider
                        {...input}
                        min={0}
                        max={1000}
                        step={1}
                        onChange={(e, value) => form.mutators.update('pants', value)}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid className={classes.valueContainer} item xs={8}>
                  <Typography className={classes.title} variant="h6" component="h3">
                    <Field name="pants">
                      {({ input, meta }) => (
                        'R$ ' + (input.value || 0.00)
                      )}
                    </Field>
                  </Typography>
                </Grid>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Grid className={classes.labelContainer} item xs={8}>
                  <Typography id="label">Bermudas e Shorts</Typography>
                </Grid>
                <Grid className={classes.sliderContainer} item xs={8}>
                  <Field name="shorts">
                    {({ input, meta }) => (
                      <Slider
                        {...input}
                        min={0}
                        max={1000}
                        step={1}
                        onChange={(e, value) => form.mutators.update('shorts', value)}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid className={classes.valueContainer} item xs={8}>
                  <Typography className={classes.title} variant="h6" component="h3">
                    <Field name="shorts">
                      {({ input, meta }) => (
                        'R$ ' + (input.value || 0.00)
                      )}
                    </Field>
                  </Typography>
                </Grid>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Grid className={classes.labelContainer} item xs={8}>
                  <Typography id="label">Calçados</Typography>
                </Grid>
                <Grid className={classes.sliderContainer} item xs={8}>
                  <Field name="shoes">
                    {({ input, meta }) => (
                      <Slider
                        {...input}
                        min={0}
                        max={1000}
                        step={1}
                        onChange={(e, value) => form.mutators.update('shoes', value)}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid className={classes.valueContainer} item xs={8}>
                  <Typography className={classes.title} variant="h6" component="h3">
                    <Field name="shoes">
                      {({ input, meta }) => (
                        'R$ ' + (input.value || 0.00)
                      )}
                    </Field>
                  </Typography>
                </Grid>
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
