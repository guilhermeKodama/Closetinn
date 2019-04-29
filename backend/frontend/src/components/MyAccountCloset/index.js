import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Popper from '@material-ui/core/Popper'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import styles from './styles.js'

import {
  updateUser
} from '../../modules/user/actions'

import { actions as actionsSearch } from '../../modules/search/actions'

import { userSelector } from '../../modules/user/selectors'
import { searchSelector } from '../../modules/search/selectors'

class Profile extends  PureComponent  {
  state = {
    query: ''
  }

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }))
  }

  handleClose = event => {
    const { cleanSearch } = this.props
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    // clean search
    cleanSearch()
  }

  update = ([name, value], state, { changeValue }) => {
    changeValue(state, name, v => value)
  }

  onSubmit = data => {
    const { updateUser } = this.props
    updateUser(data)
  }

  render() {
    const { user, productsSearch, search, classes } = this.props
    const { query } = this.state

    return (
      <Form
        initialValues={{ myCloset: user.myCloset }}
        mutators={{
          ...arrayMutators,
          update: this.update
        }}
        onSubmit={this.onSubmit}
        subscription={{ submitting: true, pristine: true }}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <Typography className={classes.title} variant="h4" component="h3">
              Meu Closet
            </Typography>
            <Grid className={classes.contentRow} container spacing={24}>
              <Grid className={classes.contentRow} item xs={12}>
                <Typography className={classes.subTitle}>
                  Adicione as peças de roupa que você possue e te recomendaremos roupas que possam combinar, sugestões e evitaremos recomendacões com peças que você já tem.
                </Typography>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <TextField
                  inputRef={node => { this.anchorEl = node }}
                  value={query}
                  label="Procurar"
                  fullWidth
                  placeholder="Digite a roupa que você deseja adicionar"
                  className={classes.textField}
                  margin="normal"
                  onChange={(e, value) => {
                    search(e.target.value)
                    return this.setState({ query: e.target.value })
                  }}
                />
                <Popper open={!!productsSearch} anchorEl={this.anchorEl} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={this.handleClose}>
                            <MenuList>
                              { !!productsSearch && productsSearch.map( product => (
                                <MenuItem
                                onClick={e => {
                                  form.mutators.push('myCloset', product)
                                  this.handleClose(e)
                                }}
                                >
                                {product.productName}
                                </MenuItem>
                              ))}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
              </Grid>
              <Grid className={classes.contentColumn} item xs={12}>
                <FieldArray name="myCloset">
                  {({ fields }) =>
                    fields.map((product, index) => (
                      <div className={classes.productRow} key={product}>
                        <Field name={`${product}.productName`}>
                          {({ input, meta }) => (
                            <Typography className={classes.productName}>
                              {input.value}
                            </Typography>
                          )}
                        </Field>
                        <span
                          role="img"
                          onClick={() => fields.remove(index)}
                          style={{ cursor: 'pointer' }}>
                          ❌
                        </span>
                      </div>
                    ))}
                </FieldArray>
              </Grid>
              <Grid className={classes.contentRow} item xs={12}>
                <Button className={classes.submit} type="submit" size="large" variant="contained" color="primary">
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  user: userSelector(),
  productsSearch: searchSelector()
})

const mapDispatchToProps = dispatch => ({
  updateUser: data => dispatch(updateUser(data)),
  search: query => dispatch(actionsSearch.search(query)),
  cleanSearch: () => dispatch(actionsSearch.cleanSearch())
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Profile))
