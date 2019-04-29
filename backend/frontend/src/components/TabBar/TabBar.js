import React from 'react'
import PropTypes from 'prop-types'
import styles from './TabBar.scss'

const TarBar = ({ children, onSelectedIndex, selectedIndex}) => {
  const onSelect = (index) => (e) => {
    onSelectedIndex(e, index)
  }

  return (
    <div className={styles.TabBar}>
      {
        children.map((child, index) => <button key={index} className={`${ selectedIndex === index && styles.active} ${styles.tab}`} onClick={onSelect(index)}>{child}</button>)
      }
    </div>
  )
}

TarBar.defaultProps = {
  children: [],
  onSelectedIndex: () => {}
}

TarBar.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  onSelectedIndex: PropTypes.func
}

export default TarBar
