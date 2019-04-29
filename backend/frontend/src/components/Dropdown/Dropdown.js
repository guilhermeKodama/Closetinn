import React, { Component } from 'react'
import styles from './Dropdown.scss'

class Dropdown extends Component {
  state = {
    selected: ''
  }

  componentWillReceiveProps(nextProps) {
    const children = nextProps.children
    if (children) {
      const defaultValue = children[0].props.children
      if (defaultValue) this.setState(() => ({ selected: defaultValue }))
    }
  }

  onSelect = e => {
    const selected = e.target.childNodes[0].textContent
    if (selected) {
      this.setState(() => ({ selected }))
      this.props.onValueChange(selected)
    }
  }

  renderOption = () => {
    const { children = [] } = this.props
    return children.map((child, index) =>
      <div
        key={index}
        onClick={this.onSelect}
      >
        {child}
      </div>)
  }

  render() {
    return (
      <div className={styles.Dropdown}>
        <button>
          {this.state.selected}
          <i className='material-icons'>arrow_drop_down</i>
        </button>
        <div className={styles.dropdownContent}>
          {
            this.renderOption()
          }
        </div>
      </div>
    )
  }
}

Dropdown.defaultProps = {
  onValueChange: () => {}
}

export default Dropdown
