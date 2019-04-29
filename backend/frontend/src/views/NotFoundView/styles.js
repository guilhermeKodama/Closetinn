const styles = theme => ({
  root: {
    width: '100%',
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing.unit* 2}px)`,
    margin: '0 auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('lg')]: { maxWidth: 1440 },
  },
  title: {
    [theme.breakpoints.up('md')]: { maxWidth: 1000 },
    marginBottom: theme.spacing.unit * 5,
  },
})

export default styles
