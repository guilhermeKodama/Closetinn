import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import NumberFormat from 'react-number-format'

import { withStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

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

class FilterOption extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      priceMin: props.min && props.min.toString(),
      priceMax: props.max && props.max.toString(),
    }
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

  renderControl = () => {
    const { classes, type, filter, option, minPlaceholder, maxPlaceholder, checked, onToggleCheckbox } = this.props,
          { priceMin, priceMax } = this.state

    switch (type) {
      case 'checkbox':
        return (
          <Checkbox
            value={option}
            onChange={onToggleCheckbox(filter, option)}
            checked={checked}
          />
        )
      case 'range':
        return (
          <Fragment>
            <TextField
              className={classes.textField}
              label='Min'
              placeholder={`R$ ${minPlaceholder}`}
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
              placeholder={`R$ ${maxPlaceholder}`}
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

  render() {
    const { classes, option } = this.props

    return (
      <Fragment>
        <FormControlLabel
          className={classes.formControlLabel}
          key={option}
          control={this.renderControl()}
          label={option}
        />
      </Fragment>
    )
  }
}

FilterOption.propTypes = {
  filters: PropTypes.array.isRequired,
  onShowMore: PropTypes.func,
  onToggleCheckbox: PropTypes.func,
  isChecked: PropTypes.func,
}

FilterOption.defaultProps = {
  filters: [],
  onToggleCheckbox: (filter, option) => {},
  isChecked: (filter, option) => {}
}

export default withStyles(styles)(FilterOption)
