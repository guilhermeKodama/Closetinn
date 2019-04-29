const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  menu: {
    width: 250,
  },
  listItem: {
    textDecoration: 'none',
  },
  subcategory: {
    textDecoration: 'none',
    paddingLeft: theme.spacing.unit * 4,
  },
  listSubheader: {
    background: 'white',
  },
})

export default styles
