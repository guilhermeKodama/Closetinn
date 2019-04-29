import React, { PureComponent } from 'react'
import styles from './DrawerCollapseItem.scss'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ListItemText from '@material-ui/core/ListItemText';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

class DrawerCollapseItem extends PureComponent {
  state = {
    open: false
  }

  onOpenClick = e => {
    this.setState((prevState) => ({ open: !prevState.open }));
  };

  render() {
    const { children, title } = this.props,
          { open } = this.state

    return (
      <div className={styles.DrawerCollapseItem}>
        <ListItem
          className={styles.listItem}
          button
          onClick={this.onOpenClick}
        >
          <ListItemText primary={title} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse
          in={open}
          timeout='auto'
          unmountOnExit
        >
          {
            children &&
            <List component='div' disablePadding>
              { children }
            </List>
          }
        </Collapse>
      </div>
    )
  }
}

DrawerCollapseItem.defaultProps = {

}

export default DrawerCollapseItem
