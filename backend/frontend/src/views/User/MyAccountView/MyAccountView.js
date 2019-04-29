import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'

import Divider from '@material-ui/core/Divider'

import InboxIcon from '@material-ui/icons/Inbox'
import DraftsIcon from '@material-ui/icons/Drafts'

import Profile from '../../../components/MyAccountProfile'
import Recommendation from '../../../components/MyAccountRecommendations'
import Closet from '../../../components/MyAccountCloset'
import Budget from '../../../components/MyAccountBudget'
import Sizes from '../../../components/MyAccountSizes'
import Appearence from '../../../components/MyAccountAppearence'

import withWidth, { isWidthUp } from '@material-ui/core/withWidth'

import { logout } from '../../../modules/user/actions'

import styles from './styles.js'

class MyAccountView extends  PureComponent  {
  state = {
    selectedIndex: 0,
    isSelected: false
  }

  handleListItemClick = (event, index) => {
    const { logout } = this.props
    if (index === 6) {
      return logout()
    }

    this.setState({
      selectedIndex: index,
      isSelected: true
    })
  }

  renderMenu = (selectedIndex, upMedium) => (
    <Grid item xs={upMedium ? 3 : 12}>
        <List component="nav">
        <ListItem
          button
          selected={selectedIndex === 0}
          onClick={event => this.handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Minha conta" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 1}
          onClick={event => this.handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Recomendações" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 2}
          onClick={event => this.handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Meu closet" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 3}
          onClick={event => this.handleListItemClick(event, 3)}
        >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Orçamentos" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 4}
          onClick={event => this.handleListItemClick(event, 4)}
        >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Tamanhos" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 5}
          onClick={event => this.handleListItemClick(event, 5)}
        >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Aparência" />
        </ListItem>
      </List>
      <Divider />
      <List component="nav">
        <ListItem
          button
          selected={selectedIndex === 6}
          onClick={event => this.handleListItemClick(event, 6)}
        >
          <ListItemText primary="Sair" />
        </ListItem>
      </List>
    </Grid>
  )

  renderView = (selectedIndex, classes, upMedium) => (
    <Grid className={classes.contentColumn} item xs={upMedium ? 8 : 12}>
      { selectedIndex === 0 && <Profile /> }
      { selectedIndex === 1 && <Recommendation /> }
      { selectedIndex === 2 && <Closet /> }
      { selectedIndex === 3 && <Budget /> }
      { selectedIndex === 4 && <Sizes /> }
      { selectedIndex === 5 && <Appearence /> }
    </Grid>
  )

  handleBack = () => {
    this.setState({
      isSelected: false
    })
  }

  render() {
    const { selectedIndex, isSelected } = this.state
    const { classes, width } = this.props
    const upMedium = isWidthUp('md', width)

    if (isSelected && !upMedium) {
      return (
        <div className={classes.root}>
          <Grid container spacing={24}>
            <Button onClick={this.handleBack} size="medium" className={classes.margin}>
              {'< Voltar'}
            </Button>
            {this.renderView(selectedIndex, classes, upMedium)}
          </Grid>
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          {this.renderMenu(selectedIndex, upMedium)}
          {upMedium && this.renderView(selectedIndex, classes, upMedium)}
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = () =>({})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
})

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MyAccountView)))
