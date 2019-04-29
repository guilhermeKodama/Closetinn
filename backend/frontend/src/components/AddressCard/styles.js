const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 3,
  },
  gridItem: {
    paddingRight: theme.spacing.unit * 2
  },
  cardAddress: {
    width: '100%',
    minWidth: 375,
    [theme.breakpoints.up('sm')]: {
      maxWidth: 600,
    },
  },
})

export default styles
