import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import styles from './styles.js'

import ClosetFolder from '../../components/ClosetFolder'
import ProductCard from '../../components/ProductCard'
import ClosetRemoveFolderModal from '../../components/ClosetRemoveFolderModal'
import ClosetCreateFolderModal from '../../components/ClosetCreateFolderModal'
// import Dropdown from '../../components/Dropdown'
// import TabBar from '../../components/TabBar'

import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Grid from '@material-ui/core/Grid'

import { getCloset } from '../../actions/closet'
import { createFolderModalOpen, removeFolderModalOpen, removeFolderModalClose, editFolderModalOpen, editFolderModalClose } from '../../actions/app'
import { closetRemoveFolder, closetEditFolder, removeProductFromClosetFolder } from '../../actions/closet'

class ClosetView extends Component {
  state = {
    options: ['recente', 'antigos', '+ itens', '- itens'],
    selectedFolder: null,
    isEditingFolderName: false,
    newFolderName: '',
    isNicheMode: true,
    tabSelectedIndex: 0,
    value: 0
  }

  componentDidMount() {
    this.props.getCloset()
  }

  componentWillReceiveProps(nextProps) {
    const { folderId } = nextProps.match.params
    const { closet } = nextProps

    /*
      Se contém o parâmetro folderId então o modo de visualização
      é de produtos de um nicho, caso contrário a lista de nichos
    */
    if (folderId) {
      const folders = closet.filter(folder => folder._id === folderId)
      if (folders.length > 0) {
        this.setState(() => ({
          selectedFolder: folders[0],
          newFolderName: folders[0].folderName
        }))
      }
    } else {
      this.setState(() => ({ selectedFolder: null }))
    }
  }

  onCancelRemoveFolderClick = e => {
    this.props.removeFolderModalClose()
  }

  onConfirmRemoveFolderClick = e => {
    const { app: { closet } } = this.props
    this.props.closetRemoveFolder(closet.selectedFolder._id)
    this.props.removeFolderModalClose()
  }

  onSelectFolder = (e, folderId) => {
    this.props.history.push(`/closet/${folderId}`)
  }

  onDeleteFolder = (e, folder) => {
    this.props.removeFolderModalOpen(folder)
  }

  onEditFolder = (e, folder) => {
    this.props.editFolderModalOpen(folder)
  }

  onCancelEditFolderClick = e => {
    this.props.editFolderModalClose()
  }

  onCreateFolder = e => {
    this.props.createFolderModalOpen()
  }

  onSelectProductCard = (e, cloth) => {
    this.props.history.push(`/clothes/${cloth._id}`)
  }

  onProductCardRemove = (e, folderId, productId) => {
    this.props.removeProductFromClosetFolder(folderId, productId)
  }

  onFolderNameChange = e => {
    const newFolderName = e.target.value
    this.setState(() => ({ newFolderName: newFolderName }))
  }

  onEditFolderNameClick = e => {
    this.setState(prevState => ({ isEditingFolderName: !prevState.isEditingFolderName }))
  }

  onFolderNameKeyPress = e => {
    const newFolderName = e.target.value.trim()

    if (e.key === 'Enter' && newFolderName) {
      const { selectedFolder } = this.state
      this.props.closetEditFolder(selectedFolder._id, newFolderName)
    }
  }

  renderDropdownContent = () => {
    const { options } = this.state
    return options.map(option => <p key={option}>{option}</p>)
  }

  renderFolder = () => {
    const { closet } = this.props

    const createFolder = (
      <Grid key={'create'} item xs={6} sm={3}>
        <ClosetFolder
          type='create'
          title='&#43; Criar novo nicho'
          onSelect={this.onCreateFolder}
        />
      </Grid>
    )

    const folders = closet.map(folder =>
      <Grid key={folder._id} item xs={6} sm={3}>
        <ClosetFolder
          editMode={true}
          folder={folder}
          cover=''
          onSelect={this.onSelectFolder}
          onDelete={this.onDeleteFolder}
          onEdit={this.onEditFolder}
        />
      </Grid>
    )

    return [createFolder, ...folders]
  }

  renderFolderProducts = () => {
    const { selectedFolder } = this.state

    return selectedFolder.products.map(product =>
      <ProductCard
        key={product._id}
        folderId={selectedFolder._id}
        product={product}
        favorited
        onSelect={this.onSelectProductCard}
        onRemove={this.onProductCardRemove}
      />)
  }

  renderAllProducts = () => {
    const { closet } = this.props

    return closet.map(folder => folder.products.map(product =>
      <Grid
        key={product._id}
        item
        xs={6}
        sm={3}
      >
        <ProductCard
          folderId={folder._id}
          product={product}
          favorited
          onSelect={this.onSelectProductCard}
          onRemove={this.onProductCardRemove}
        />
      </Grid>
    ))
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { classes } = this.props
    const { value } = this.state
    return (
      <div className={classes.root}>
        <ClosetRemoveFolderModal
          onConfirm={this.onConfirmRemoveFolderClick}
          onCancel={this.onCancelRemoveFolderClick}
          onRequestClose={this.onCancelRemoveFolderClick}
        />
        <ClosetCreateFolderModal />
        <Tabs
          value={value}
          onChange={this.handleChange}
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        >
          <Tab
            disableRipple
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            label="MEU CLOSET"
          />
          <Tab
            disableRipple
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            label="TODAS AS ROUPAS SALVAS"
          />
        </Tabs>
        <Grid className={classes.grid} container spacing={24}>
          {value === 0 && this.renderFolder()}
          {value === 1 && this.renderAllProducts()}
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app,
  closet: state.user.data.closet,
})

const mapDispatchToProps = dispatch => ({
  getCloset: () => dispatch(getCloset()),
  removeFolderModalOpen: (folder) => dispatch(removeFolderModalOpen(folder)),
  removeFolderModalClose: () => dispatch(removeFolderModalClose()),
  editFolderModalOpen: (folder) => dispatch(editFolderModalOpen(folder)),
  editFolderModalClose: () => dispatch(editFolderModalClose()),
  createFolderModalOpen: () => dispatch(createFolderModalOpen()),
  closetRemoveFolder: (folderId) => dispatch(closetRemoveFolder(folderId)),
  closetEditFolder: (folderId, folderName, description) => dispatch(closetEditFolder(folderId, folderName, description)),
  removeProductFromClosetFolder: (folderId, productId) => dispatch(removeProductFromClosetFolder(folderId, productId))
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ClosetView))
