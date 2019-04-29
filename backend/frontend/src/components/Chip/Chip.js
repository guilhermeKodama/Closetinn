import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './Chip.scss'

import Chip from '@material-ui/core/Chip'

import Icon from '@material-ui/core/Icon'

class ChipSelect extends PureComponent {
  state = {
    selected: false,
  }

  onChipClick = e => {
    this.setState((prevState) => ({ selected: !prevState.selected }))
    this.props.onClick(e)
  }

  onChipDelete = e => {
    const { title } = this.props
    this.props.onDelete(e, title)
  }

  checkIcon = <Icon className={styles.checkIcon}>done</Icon>

  render() {
    const { title } = this.props,
          { selected } = this.state

    return (
      <Chip
        className={styles.Chip}
        avatar={selected ? this.checkIcon : null}
        label={title}
        onClick={this.onChipClick}
        onDelete={this.onChipDelete}
      />
    )
  }
}

ChipSelect.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
}

ChipSelect.defaultProps = {
  title: '',
  onClick: () => {},
}

export default ChipSelect
