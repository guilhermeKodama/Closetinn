import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'

import styles from './styles'

import HangerIcon from '../../styles/icons/hanger-icon.svg'

import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Hidden from '@material-ui/core/Hidden'

import PersonIcon from '@material-ui/icons/Person'
import Receipt from '@material-ui/icons/Receipt'

import { drawerToggle } from '../../actions/app'
import { clearFilter } from '../../actions/filters'

import { openDrawerSelector } from '../../selectors/app'
import { loggedSelector } from '../../modules/user/selectors'
import { categoriesSelector } from '../../selectors/cloth'

import DrawerCollapseItem from '../DrawerCollapseItem'

class DrawerMenu extends PureComponent {
  renderItem = () => {
    const { categories } = this.props

    return Object.keys(categories).map(gender =>
      <DrawerCollapseItem
        key={gender}
        title={gender}
      >
        {/* { Object.keys(categories[gender]).map(renderNestedItem) } */}
        { Object.keys(categories[gender]).map(category => categories[gender][category].map(subcategory => this.renderNestedItem(gender, category, subcategory))) }
      </DrawerCollapseItem>
    )
  }

  renderNestedItem = (gender, category, subcategory) => {
    const { classes, onDrawerToggle } = this.props

    return (
      <ListItem
        key={subcategory}
        className={classes.subcategory}
        button
        onClick={this.onCategorySelect(gender, category, subcategory)}
        onKeyDown={onDrawerToggle}

      >
        <ListItemText primary={subcategory} />
      </ListItem>
    )
  }

  renderLoggedOptions = () => {
    const { classes, onDrawerToggle } = this.props

    return (
      <Fragment>
        <ListItem
          className={classes.listItem}
          button
          onClick={onDrawerToggle}
          onKeyDown={onDrawerToggle}
          component={Link}
          to={'/closet'}

        >
          <Avatar>
            <HangerIcon/>
          </Avatar>
          <ListItemText primary='MEU CLOSET' />
        </ListItem>
        <ListItem
          className={classes.listItem}
          button
          onClick={onDrawerToggle}
          onKeyDown={onDrawerToggle}
          component={Link}
          to={'/myOrders'}

        >
          <Avatar>
            <Receipt/>
          </Avatar>
          <ListItemText primary='MEUS PEDIDOS' />
        </ListItem>
      </Fragment>
    )
  }

  onCategorySelect = (gender, category, subcategory) => e => {
    const { clearFilter, onDrawerToggle, history } = this.props
    clearFilter()
    onDrawerToggle()
    const path = category === subcategory ? `/categories?gender=${gender}&parentCategory=${category}` : `/categories?gender=${gender}&parentCategory=${category}&subCategory=${subcategory}`
    history.push(path)
  }

  render() {
    const { classes, open, logged, categories, onDrawerToggle } = this.props

    return (
      <Drawer
        open={open}
        onClose={onDrawerToggle}
      >
        <div className={classes.menu}>
          <List>
            <ListItem
              className={classes.listItem}
              button
              onClick={onDrawerToggle}
              onKeyDown={onDrawerToggle}
              component={Link}
              to={`${logged ? '/profile' : '/signin'}`}
            >
              <Avatar>
                <PersonIcon />
              </Avatar>
              <ListItemText primary={ `${logged ? 'PERFIL' : 'ENTRAR'}`} />
            </ListItem>
            { logged && this.renderLoggedOptions() }
          </List>
          {
            categories &&
            <Hidden smUp>
              <List subheader={<ListSubheader className={classes.listSubheader}>Categorias</ListSubheader>}>
                { this.renderItem() }
              </List>
            </Hidden>
          }
        </div>
      </Drawer>
    )
  }
}

DrawerMenu.defaultProps = {
  onClose: () => {}
}

const mapStateToProps = createStructuredSelector({
  logged: loggedSelector(),
  open: openDrawerSelector(),
  categories: categoriesSelector(),
})

const mapDispatchToProps = dispatch => ({
  onDrawerToggle: () => dispatch(drawerToggle()),
  clearFilter: () => dispatch(clearFilter()),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DrawerMenu))
