import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'

import FilterGroup from '../FilterGroup'
import FilterOption from '../FilterOption'

class Filter extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.filters !== nextProps.filters ||
           this.props.selectedFilters !== nextProps.selectedFilters
  }

  checked = (filter, option) => {
    const { selectedFilters } = this.props
    const hasKey = filter in selectedFilters

    if (hasKey) {
      return selectedFilters[filter].includes(option)
    }
    return false
  }

  onToggleCheckbox = (filter, option) => e => {
    const { selectedFilters, onOptionSelect, onOptionDeselect } = this.props
    const hasKey = filter in selectedFilters
    let index = -1

    if (hasKey) index = selectedFilters[filter].indexOf(option)

    if (index === -1) {
      onOptionSelect(e, filter, option)
    } else {
      onOptionDeselect(e, filter, option)
    }
  }

  onFilterPriceKeyPress = (e, filter, price) => {
    const { onPriceKeyPress } = this.props
    onPriceKeyPress(e, filter, price)
  }

  renderOption = (type, filter, option) => {
    const checked = this.checked(filter, option)

    return (
      <FilterOption
        key={option}
        type={type}
        filter={filter}
        option={option}
        onToggleCheckbox={this.onToggleCheckbox}
        checked={checked}
      />
    )
  }

  renderFilter = ({ filter, name, options, min, max, type }) => {
    switch (type) {
      case 'checkbox':
        return (
          <FilterGroup
            key={filter}
            filter={filter}
            name={name}
          >
            {
              options.map(option => this.renderOption(type, filter, option))
            }
          </FilterGroup>
        )
      case 'range':
        const { selectedFilters: { priceMin, priceMax } } = this.props

        return (
          <FilterGroup
            key={filter}
            filter={filter}
            name={name}
          >
            <FilterOption
              key={filter}
              type={type}
              filter={filter}
              minPlaceholder={min}
              min={priceMin}
              maxPlaceholder={max}
              max={priceMax}
              onPriceKeyPress={this.onFilterPriceKeyPress}
            />
          </FilterGroup>
        )
      default: return null
    }
  }

  render() {
    const { classes, filters } = this.props

    return (
      <div className={classes.root}>
        { filters.map(this.renderFilter) }
      </div>
    )
  }
}

Filter.propTypes = {
  filters: PropTypes.array.isRequired,
}

Filter.defaultProps = {
  filters: [],
}

export default withStyles(styles)(Filter)
