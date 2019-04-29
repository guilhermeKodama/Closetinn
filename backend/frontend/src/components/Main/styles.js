const styles = theme => ({
  root: {
    width: '100%',
    flex: 1,
    margin: '0 auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('md')]: { marginBottom: 500 },
    [theme.breakpoints.up('lg')]: { maxWidth: 1440 },
  },
  toolbar: theme.mixins.toolbar,
})

export default styles
