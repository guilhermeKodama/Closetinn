import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import NumberFormat from 'react-number-format'

import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Hidden from '@material-ui/core/Hidden'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import Close from '@material-ui/icons/Close'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ChevronRight from '@material-ui/icons/ChevronRight'

import Chip from '../../components/Chip'

const filterType = {
  CHECKBOX: 'checkbox',
  RANGE: 'range',
}

const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props

  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        })
      }}
      prefix='R$ '
    />
  )
}

const Transition = props => {
  return <Slide direction='up' {...props} />
}

class FilterModal extends Component {
  state = {
    anchorEl: null,
    priceMin: '',
    priceMax: '',
  }

  onCloseClick = e => {
    const { onClose } = this.props
    onClose(e)
  }

  onApplyClick = e => {
    const { onApply } = this.props
    onApply(e)
  }

  onFilterSelect = index => e => {
    const { onSelect } = this.props
    onSelect(e, index)
  }

  onFilterDelete = (filter, option) => e => {
    const { onFilterDelete } = this.props
    onFilterDelete(e, filter, option)
  }

  onMinPriceChange = e => {
    const priceMin = e.target.value
    this.setState(() => ({ priceMin }))
  }

  onMaxPriceChange = e => {
    const priceMax = e.target.value
    this.setState(() => ({ priceMax }))
  }

  onPriceKeyPress = e => {
    if (e.key === 'Enter') {
      const { filter, onPriceKeyPress } = this.props,
      { priceMin, priceMax } = this.state
      onPriceKeyPress(e, filter, { priceMin: parseFloat(priceMin), priceMax: parseFloat(priceMax) })
    }
  }

  renderFilter = (index, { type, filter, name, min, max }) => {
    const { classes } = this.props,
          { priceMin, priceMax } = this.state

    switch (type) {
      case filterType.CHECKBOX:
        return (
          <ListItem
            key={filter}
            button
            onClick={this.onFilterSelect(index)}
          >
            <ListItemText primary={name} />
            <ChevronRight />
          </ListItem>
        )
      case filterType.RANGE:
        return (
          <Fragment key={filter}>
            <TextField
              className={classes.textField}
              label='Min'
              placeholder={`R$ ${min}`}
              value={priceMin}
              onChange={this.onMinPriceChange}
              onKeyPress={this.onPriceKeyPress}
              margin='dense'
              InputProps={{ inputComponent: NumberFormatCustom }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              className={classes.textField}
              label='Max'
              placeholder={`R$ ${max}`}
              value={priceMax}
              onChange={this.onMaxPriceChange}
              onKeyPress={this.onPriceKeyPress}
              margin='dense'
              InputProps={{ inputComponent: NumberFormatCustom }}
              InputLabelProps={{ shrink: true }}
            />
          </Fragment>
        )
      default: return null
    }
  }

  renderSelected = filter => {
    const { selectedFilters } = this.props

    return (
      Array.isArray(selectedFilters[filter]) &&
      <List
        key={filter}
        subheader={<ListSubheader>{filter}</ListSubheader>}
      >
        {
          selectedFilters[filter].map(option => this.renderOption(filter, option))
        }
      </List>
    )
  }

  renderOption = (filter, option) => (
    <Chip
      key={option}
      title={option}
      onDelete={this.onFilterDelete(filter, option)}
    />
  )

  onMenuClick = e => {
    const anchorEl = e.currentTarget
    this.setState(() => ({ anchorEl }))
  }

  onMenuClose = () => {
    this.setState(() => ({ anchorEl: null }))
  }

  onClearFilterClick = e => {
    const { onClearFilter } = this.props
    onClearFilter(e)
    this.onMenuClose()
  }

  render() {
    const { classes, open, filters, selectedFilters,  } = this.props,
          { anchorEl } = this.state

    return (
      <Hidden smUp>
        <Dialog
          fullScreen
          open={open}
          onClose={this.onCloseClick}
          TransitionComponent={Transition}
        >
          <AppBar position='sticky'>
            <Toolbar disableGutters={true}>
              <IconButton
                color='inherit'
                aria-label='Close'
                onClick={this.onCloseClick}
              >
                <Close />
              </IconButton>
              <Typography
                className={classes.toolbarTitle}
                color='inherit'
                variant='title'
              >
                Filtro
              </Typography>
              <IconButton
                color='inherit'
                aria-label='More'
                aria-owns={anchorEl ? 'long-menu' : null}
                aria-haspopup='true'
                onClick={this.onMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id='long-menu'
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={this.onMenuClose}
              >
                <MenuItem onClick={this.onClearFilterClick}>Limpar filtros</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <List className={classes.list}>
            {
              filters.map((filter, index) => this.renderFilter(index, filter))
            }
            {
              Object.keys(selectedFilters).map(this.renderSelected)
            }
          </List>
          <Button
            className={classes.button}
            variant='outlined'
            onClick={this.onApplyClick}
          >
            Aplicar
          </Button>
        </Dialog>
      </Hidden>
    )
  }
}

FilterModal.propTypes = {
  filters: PropTypes.array.isRequired,
}

FilterModal.defaultProps = {
  filters: [],
}

export default withStyles(styles)(FilterModal)
