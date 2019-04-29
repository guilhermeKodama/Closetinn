import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createFolderModalClose } from '../../actions/app'
import { closetCreateFolder, closetEditFolder } from '../../actions/closet'
import NicheDialogForm from '../../forms/NicheDialogForm'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import withMobileDialog from '@material-ui/core/withMobileDialog'

class ClosetCreateFolderModal extends Component {

  state = {
    open: false,
  }

  handleClose = () => {
    this.props.createFolderModalClose()
  }


  onSaveFolder = (data) => {
    const { folder } = this.props
    if(!folder) {
      this.props.closetCreateFolder(data.name, data.description)
    } else {
      this.props.closetEditFolder(folder._id, data.name, data.description)
    }
    this.handleClose()
  }

  render() {
    const { app: { closet }, fullScreen } = this.props

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={closet.isCreateFolderModalOpen}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
          >
          <DialogTitle id="responsive-dialog-title">Criar nicho</DialogTitle>
          <NicheDialogForm handleClose={this.handleClose} onSubmit={this.onSaveFolder} />
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    app: state.app,
    folder: state.app.closet && state.app.closet.selectedFolder
  }
}

const mapDispatchToProps = (dispatch) => ({
  createFolderModalClose: () => dispatch(createFolderModalClose()),
  closetCreateFolder: (name, description) => dispatch(closetCreateFolder(name, description)),
  closetEditFolder: (folderId, folderName, description) => dispatch(closetEditFolder(folderId, folderName, description)),
})

export default withMobileDialog()(connect(mapStateToProps, mapDispatchToProps)(ClosetCreateFolderModal))
