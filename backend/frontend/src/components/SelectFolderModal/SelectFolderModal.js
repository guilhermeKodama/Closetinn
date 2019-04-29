import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './styles'

import { favoriteModalClose } from '../../actions/app'
import { closetCreateFolder, addProductToClosetFolder } from '../../actions/closet'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import withMobileDialog from '@material-ui/core/withMobileDialog'

class SelectFolderModal extends Component {

  state = {
    filter: '',
    isCreateMode: false
  }

  onFolderSelected = (folderId) => {
    const { app: { closet } } = this.props
    this.props.addProductToClosetFolder(folderId, closet.favoritedProduct._id)
    this.onClose()
  }

  onCreateFolder = e => {
    this.onClose()
    this.props.history.push('/closet')
  }

  onFilterChange = (e) => {
    const text = e.target.value.trim()
    this.setState(() => ({ filter: text }))
  }

  onClose = e => {
    this.props.favoriteModalClose()
    this.setState(() => ({ isCreateMode: false }))
  }

  render() {
    const { classes, fullScreen, user:  { data: { closet } }, app } = this.props
    const product = app.closet.favoritedProduct

    return (
      <Dialog
        fullScreen={fullScreen}
        open={app.closet.isFavoriteModalOpen}
        onClose={this.onClose}
        aria-labelledby="scroll-dialog-title"
      >
        {
          fullScreen &&
          <AppBar position='sticky'>
            <Toolbar disableGutters={true}>
              <IconButton color="inherit" onClick={this.onClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" >
                Favoritar
              </Typography>
            </Toolbar>
          </AppBar>
        }
        {
          !fullScreen &&
          <DialogTitle id="scroll-dialog-title">Escolha um nicho</DialogTitle>
        }
        <DialogContent className={classes.content}>
          <div className={classes.product}>
            <img className={classes.image} src={product && product.image_medium_url} alt={product && product.productName} />
            <Typography variant='headline'>
              {product && product.productName}
            </Typography>
          </div>
          <Typography variant="headline" component="h3">
            Seus nichos:
          </Typography>
          <List>
          {
            closet &&
            closet.map( (folder, index) =>
              <ListItem key={index} button onClick={this.onFolderSelected.bind(this, folder._id)}>
                <ListItemText primary={folder.folderName} />
              </ListItem>
            )
          }
          </List>
        </DialogContent>
        <DialogActions>
          {
            !fullScreen &&
            <Button onClick={this.onClose} color='primary' autoFocus>
              Cancelar
            </Button>
          }
          <Button onClick={this.onCreateFolder} color='primary'>
            Criar nova pasta
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  favoriteModalClose: () => dispatch(favoriteModalClose()),
  closetCreateFolder: (folderName, description, productId) => dispatch(closetCreateFolder(folderName, description, productId)),
  addProductToClosetFolder: (folderId, productId) => dispatch(addProductToClosetFolder(folderId, productId))
})

const mapStateToProps = state => ({
  app: state.app,
  user: state.user
})

export default withMobileDialog()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SelectFolderModal)))
