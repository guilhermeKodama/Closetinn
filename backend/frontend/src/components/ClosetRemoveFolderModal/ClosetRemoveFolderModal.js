import React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const ClosetRemoveFolderModal = ({ app: { closet }, onConfirm, onCancel, onRequestClose }) => {
  const onConfirmClick = e => {
    onConfirm(e)
  }

  const onCancelClick = e => {
    onCancel(e)
  }

  return (
    <Dialog
      open={closet.isRemoveFolderModalOpen}
      keepMounted
      onClose={onRequestClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        Essa ação removerá um nicho permanentemente.
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Deseja continuar?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelClick} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirmClick} color="primary">
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ClosetRemoveFolderModal.defaultProps = {
  editMode: false,
  type: ''
}

const mapStateToProps = (state) => {
  return {
    app: state.app
  }
}

export default connect(mapStateToProps)(ClosetRemoveFolderModal)
