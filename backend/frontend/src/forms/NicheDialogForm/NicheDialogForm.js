import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import styles from './styles'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'

import { withStyles } from '@material-ui/core/styles'

import { renderTextField } from '../../utils/form'

const validate = values => {
  const errors = {}
  const requiredFields = [
    'name'
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Obrigatório'
    }
  })

  return errors
}

let NicheDialogForm = ({ classes, handleClose, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <DialogContentText>
          Um NICHO é um espacinho no seu Guarda-roupas virtual para "guardar" as brusinhas que você deseja
        </DialogContentText>

          <Field
            name='name'
            fullWidth
            placeholder='Ex.: Brusinhas maneiras'
            component={renderTextField}
            label='Nome'
          />
          <Field
            name='description'
            fullWidth
            placeholder='Ex.: Brusinhas descoladas para curtir o rolê'
            component={renderTextField}
            label='Descrição'
          />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button type="submit" color="primary" autoFocus>
          Salvar
        </Button>
      </DialogActions>
    </form>
  )
}

NicheDialogForm = reduxForm({
  form: 'NicheDialogForm',
  validate,
  destroyOnUnmount: false,
  enableReinitialize: true,
})(NicheDialogForm)

const mapStateToProps = state => {
  const folder = state.app.closet && state.app.closet.selectedFolder
  const values = folder ? { name: folder.folderName , description:  folder.description } : {}

  return ({
    initialValues: values
  })
}

export default withStyles(styles)(connect(mapStateToProps)(NicheDialogForm))
