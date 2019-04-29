import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'

import Button from '@material-ui/core/Button'

class FilterGroup extends PureComponent {
  state = {
    maxOptions: 10,
  }

  onShowMoreClick = e => {
    this.setState(prevState => ({ maxOptions: prevState.maxOptions + 10 }))
  }

  render() {
    const { filter, name, children } = this.props,
          { maxOptions } = this.state

    return (
      <Fragment>
        {
          (children.length > 0 || children) &&
          <FormControl key={filter}>
            <FormLabel>{name}</FormLabel>
            <FormGroup>
              {
                children.length > 1 ? children.slice(0, maxOptions) : children
              }
              {
                children.length > maxOptions &&
                <Button
                  onClick={this.onShowMoreClick}
                  aria-label='Show More'
                >
                  Mostrar mais
                </Button>
              }
            </FormGroup>
          </FormControl>
        }
      </Fragment>
    )
  }
}

FilterGroup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.element,
  ]),
}

FilterGroup.defaultProps = {
  children: [],
}

export default withStyles(styles)(FilterGroup)
