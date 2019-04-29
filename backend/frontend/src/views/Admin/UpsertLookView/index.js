import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { createStructuredSelector } from 'reselect'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'

import Search from '../../../components/Search'

import styles from './styles'
import { renderDropzoneInput } from '../../../utils/form'

import { loadingSelector } from '../../../modules/app/selectors'
import { getLook, createLook, updateLook } from '../../../modules/looks/actions'
import { lookSelector } from '../../../modules/looks/selectors'

const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => (value === is ? children : null)}
  </Field>
)

class UpsertLookView extends PureComponent {
  state = {
    pagination: null
  }

  componentDidMount() {
    const { getLook, match: { params: { lookId } } } = this.props

    if (lookId) getLook({lookId})
  }

  static getDerivedStateFromProps(props, state) {
    if(!isEqual(props.pagination, state.pagination)) {
      return {
        pagination: props.pagination
      }
    }

    return null
  }

  handleSubmit = values => {
    const { createLook, updateLook, look } = this.props
    const { files, products } = values

    const formData = new FormData()
    if (files && files.length > 0) formData.append('image', files[0])
    formData.append('products', JSON.stringify(products.map(product => product._id)))

    if (look) {
      updateLook({ lookId: look._id, data: formData })
    } else {
      createLook(formData)
    }
  }

  validate = values => {
    const { look } = this.props
    const errors = {}

    if (!look) {
      if (!values.files || !values.files.length === 0) {
        errors.files = 'Required'
      }
    }

    if (!values.products || !values.products.length === 0) {
      errors.products = 'Required'
    }

    return errors
  }

  render() {
    const { classes, look } = this.props

    return (
      <Form
       initialValues={look}
       mutators={{
         setPreview: ([[{ preview }]], state, utils) => {
           utils.changeValue(state, 'image', value => preview)
         },
         ...arrayMutators
       }}
       onSubmit={this.handleSubmit}
       validate={this.validate}
       render={({ handleSubmit, form }) => (
          <div className={classes.root}>
            <form
              className={classes.root}
              onSubmit={handleSubmit}
              >
              <Grid container>
                <Grid className={classes.gridItem} item xs={12}>
                  <Typography variant='headline' paragraph>
                    Criar Look
                  </Typography>
                </Grid>
                <Grid className={classes.gridItem} item xs={12} sm={6}>
                  <label htmlFor={'file'}>Files</label>
                  <div className={classes.dropzoneContainer}>
                    <Field
                    name={'files'}
                    onDrop={form.mutators.setPreview}
                    component={renderDropzoneInput}
                    />
                    <Field name={'image'} >
                      {({ input, meta }) => (
                        <img className={classes.lookImage} src={input.value} alt={'look preview'} />
                      )}
                    </Field>
                  </div>
                  <Button type="submit" variant="contained" color="primary" className={classes.button}>
                    Salvar
                  </Button>
                </Grid>
                <Grid className={classes.gridItem} item xs={12} sm={6}>
                  <ul>
                    <FieldArray name="products">
                      {({ fields }) => (
                        fields.map((name, index) => (
                          <Fragment key={name}>
                            <Condition when={`${name}.disabled`} is={true}>
                              <div className={classes.item}>
                                <Field
                                  name={`${name}.productName`}
                                  component="input"
                                  placeholder="First Name"
                                />
                                <IconButton className={classes.button}  aria-label="Delete">
                                  <Badge badgeContent='!' color='secondary'>
                                    <DeleteIcon onClick={() => fields.remove(index)} />
                                  </Badge>
                                </IconButton>
                              </div>
                            </Condition>
                            <Condition when={`${name}.disabled`} is={false}>
                              <div className={classes.item}>
                                <Field
                                  name={`${name}.productName`}
                                  component="input"
                                  placeholder="First Name"
                                />
                                <IconButton className={classes.button}  aria-label="Delete">
                                  <DeleteIcon onClick={() => fields.remove(index)} />
                                </IconButton>
                              </div>
                            </Condition>
                          </Fragment>
                        ))
                      )}
                    </FieldArray>
                  </ul>
                </Grid>
                <Grid className={classes.gridItem} item xs={12}>
                  <Search
                    type="elasticsearch"
                    handleAdd={(e, cloth, index) => form.mutators.push('products', cloth)}
                  />
                </Grid>
              </Grid>
            </form>
          </div>
       )}
      />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  loading: loadingSelector(),
  look: lookSelector(),
})

const mapDispatchToProps = dispatch => ({
  getLook: payload => dispatch(getLook(payload)),
  createLook: payload => dispatch(createLook(payload)),
  updateLook: payload => dispatch(updateLook(payload)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UpsertLookView))
