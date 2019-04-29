import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InfoIcon from '@material-ui/icons/Info'
import HomeIcon from '@material-ui/icons/Home'
import styles from './styles'


class ProfileMenuList extends PureComponent {

  handleMyAccountClick = () => {
    console.log(this.props)
    const { history, onClose } = this.props
    onClose()
    history.push('/profile')
  }

  render() {
    const { classes, anchorEl, open, onClose, logout } = this.props
    return (
      <Paper>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={open}
          onClose={onClose}
        >
          <MenuItem onClick={this.handleMyAccountClick} className={classes.menuItem}>
            <ListItemIcon className={classes.icon}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Minha conta" />
          </MenuItem>
          <MenuItem  onClick={onClose} className={classes.menuItem}>
            <ListItemIcon className={classes.icon}>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Sobre" />
          </MenuItem>
          <MenuItem onClick={() => {
            logout()
            onClose()
          }} className={classes.menuItem}>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Sair" />
          </MenuItem>
        </Menu>
      </Paper>
    )
  }
}

ProfileMenuList.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(withRouter(ProfileMenuList))
