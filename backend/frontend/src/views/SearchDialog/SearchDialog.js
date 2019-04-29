import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import DialogContent from '@material-ui/core/DialogContent'
import withMobileDialog from '@material-ui/core/withMobileDialog'

import SearchView from '../SearchView'

import { searchRequest } from '../../actions/actionCreators'

class SearchDialog extends Component {
  state = {
    search: null,
  }

  onSearchChange = (e) => {
    const query = e.target.value
    this.setState(() => ({ search: query }))
    this.props.getSearch(query)
  }

  onDetailClick = (e, cloth) => {
    const { onClose, history } = this.props
    onClose()
    history.push(`/clothes/${cloth._id}`)
  }

  render() {
    const { open, onClose,  classes, fullScreen } = this.props
    const { search } = this.state

    return (
      <Dialog
        className={classes.root}
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="scroll-dialog-title"
      >
        {
          fullScreen &&
          <AppBar position='sticky'>
            <Toolbar disableGutters={true}>
              <IconButton
                color='inherit'
                aria-label='Close'
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
              <Typography
                className={classes.toolbarTitle}
                color='inherit'
                variant='title'
              >
                Buscar
              </Typography>
            </Toolbar>
          </AppBar>
        }
        <DialogContent className={classes.content}>
          <TextField
            autoFocus
            fullWidth
            margin='normal'
            value={search}
            onChange={this.onSearchChange}
            placeholder='Digite o que você está procurando'
          />
          {
            search &&
            <SearchView onDetailClick={this.onDetailClick} />
          }
        </DialogContent>
      </Dialog>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getSearch: query => dispatch(searchRequest(query)),
})

const mapStateToProps = state => ({
  app: state.app,
  user: state.user
})

export default withMobileDialog()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SearchDialog)))
