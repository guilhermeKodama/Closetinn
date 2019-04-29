const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('lg')]: {
      margin: '0 auto',
      maxWidth: 1440,
    },
  },
  toolbar: theme.mixins.toolbar,
})

export default styles
