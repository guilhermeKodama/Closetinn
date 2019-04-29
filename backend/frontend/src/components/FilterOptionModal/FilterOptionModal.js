import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
// import Input from '@material-ui/core/Input'
import Checkbox from '@material-ui/core/Checkbox'
import Slide from '@material-ui/core/Slide'
import Hidden from '@material-ui/core/Hidden'

import ArrowBack from '@material-ui/icons/ArrowBack'

const Transition = props => {
  return <Slide direction='up' {...props}/>
}

const FilterOptionModal = ({ classes, open, selectedFilters, currentFilter: { filter, options, type }, onClose, onOptionSelect, onOptionDeselect }) => {
  const onCloseClick = e => {
    onClose(e)
  }

  const checked = option => {
    const hasKey = filter in selectedFilters

    if (hasKey) {
      return selectedFilters[filter].includes(option)
    }

    return false
  }

  const onToggleCheckbox = option => e => {
    const hasKey = filter in selectedFilters

    let index = -1

    if (hasKey) {
      index = selectedFilters[filter].indexOf(option)
    }

    if (index === -1) {
      onOptionSelect(e, filter, option)
    } else {
      onOptionDeselect(e, filter, option)
    }
  }

  const renderOption = option => (
    <ListItem
      key={option}
      button
      onClick={onToggleCheckbox(option)}
    >
      <ListItemText
        className={classes.listItemText}
        primary={option}
      />
      <ListItemSecondaryAction>
        <Checkbox
          color='primary'
          disableRipple
          onChange={onToggleCheckbox(option)}
          checked={checked(option)}
        />
      </ListItemSecondaryAction>
    </ListItem>
  )

  return (
    <Hidden smUp>
      <Dialog
        fullScreen
        open={open}
        onClose={onCloseClick}
        TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color='inherit'
                aria-label='Close'
                onClick={onCloseClick}
                >
                  <ArrowBack />
                </IconButton>
                <Typography
                  className={classes.toolbarTitle}
                  color='inherit'
                  variant='title'
                  >
                    { filter }
                  </Typography>
                </Toolbar>
              </AppBar>
              {/* <Input
                className={classes.input}
                placeholder={`Filtre por ${filter}`}
                inputProps={{
                  'aria-label': filter,
                }}
              /> */}
              <List>
                { options.map(renderOption) }
              </List>
            </Dialog>
    </Hidden>
  )
}

FilterOptionModal.propTypes = {
  filter: PropTypes.shape({
    filter: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.array,
    type: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
}

FilterOptionModal.defaultProps = {
  onClose: () => {},
  onApply: () => {},
}

export default withStyles(styles)(FilterOptionModal)
