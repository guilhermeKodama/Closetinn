import React, { PureComponent } from 'react'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'
import Hidden from '@material-ui/core/Hidden'
import Popover from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import ArrowDropDown from '@material-ui/icons/ArrowDropDown'

class MenuCategories extends PureComponent {
  state = {
    anchorEl: null,
    selectedGenre: null,
  }

  handlePopoverOpen = selectedGenre => e => {
    const anchorEl = e.currentTarget
    this.setState({ anchorEl, selectedGenre })
  }

  handlePopoverClose = () => {
    this.setState({ anchorEl: null })
  }

  handleOnExited = () => {
    this.setState({ selectedGenre: null })
  }

  handleCategorySelect = (gender, category, subcategory) => e => {
    const { onCategorySelect } = this.props
    onCategorySelect(gender, category, subcategory)
    this.handlePopoverClose()
  }

  renderGenre = genre => {
    const { classes } = this.props

    return (
      <Button
        key={genre}
        disableRipple
        onClick={this.handlePopoverOpen(genre)}
      >
        {genre}
        <ArrowDropDown className={classes.rightIcon}/>
      </Button>
    )
  }

  renderSubcategory = category => {
    const { classes, genres } = this.props,
          { selectedGenre } = this.state

    let subcategories = []
    subcategories.push(category)

    subcategories = subcategories.concat(genres[selectedGenre][category])

    return (
      !!subcategories.length &&
      <Grid
        key={category}
        className={classes.gridItem}
        item
        xs
      >
        {
          subcategories.map(subcategory =>
            <Typography
              key={subcategory}
              className={category === subcategory ? classes.category : classes.subcategory}
              noWrap
              onClick={this.handleCategorySelect(selectedGenre, category, subcategory)}
            >
              {subcategory}
            </Typography>
          )
        }
      </Grid>
    )
  }
  render() {
    const { classes, genres } = this.props,
          { anchorEl, selectedGenre } = this.state

    return (
      <Hidden xsDown>
        <div className={classes.root}>
          <div className={classes.content}>
            {
              Object.keys(genres).map(this.renderGenre)
            }
            {
              selectedGenre &&
              <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                anchorPosition={{ top: 200, left: 400 }}
                onClose={this.handlePopoverClose}
                onExited={this.handleOnExited}
                disableRestoreFocus
              >
                <Grid container className={classes.grid}>
                  {
                    Object.keys(genres[selectedGenre]).map(this.renderSubcategory)
                  }
                </Grid>
              </Popover>
            }
          </div>
        </div>
      </Hidden>
    )
  }
}

export default withStyles(styles)(MenuCategories)
