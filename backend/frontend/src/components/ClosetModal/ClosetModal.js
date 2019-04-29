import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from '../Modal'
import styles from './ClosetModal.scss'
import { favoriteModalClose } from '../../actions/app'
import { closetCreateFolder, addProductToClosetFolder } from '../../actions/closet'
import SelectFolderModal from '../SelectFolderModal'
import CreateFolderModal from '../CreateFolderModal'

class ClosetModal extends Component {
  state = {
    isCreateMode: false
  }

  onFolderSelected = (e, folderId) => {
    const { app: { closet } } = this.props
    this.props.addProductToClosetFolder(folderId, closet.favoritedProduct._id)
    this.onClose(e)
  }

  onCreateFolder = e => {
    this.setState(prevState => ({ isCreateMode: !prevState.isCreateMode }))
  }

  onSaveFolder = (e, folderName) => {
    const { app: { closet } } = this.props
    this.props.closetCreateFolder(folderName, '', closet.favoritedProduct._id)
    this.onClose(e)
  }

  onClose = e => {
    this.props.favoriteModalClose()
    this.setState(() => ({ isCreateMode: false }))
  }

  render() {
    const { app: { closet }, user } = this.props

    return (
      <div className={styles.ClosetModal}>
        <Modal
          isOpen={closet.isFavoriteModalOpen}
          onRequestClose={this.onClose}
        >
          {
            this.state.isCreateMode ?
            <CreateFolderModal onSaveFolder={this.onSaveFolder}/> :
            <SelectFolderModal user={user} product={closet.favoritedProduct} onFolderSelected={this.onFolderSelected} onCreateFolder={this.onCreateFolder}/>
          }
        </Modal>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  favoriteModalClose: () => dispatch(favoriteModalClose()),
  closetCreateFolder: (folderName, description, productId) => dispatch(closetCreateFolder(folderName, description, productId)),
  addProductToClosetFolder: (folderId, productId) => dispatch(addProductToClosetFolder(folderId, productId))
})

const mapStateToProps = (state) => {
  return {
    app: state.app,
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClosetModal)
