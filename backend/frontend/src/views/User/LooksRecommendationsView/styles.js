const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    margin: '0 auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('md')]: { marginBottom: 500 },
    [theme.breakpoints.up('lg')]: { maxWidth: 1440 },
    color: 'white',
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing.unit* 2}px)`,
    color: 'white',
  },
  title: {
    [theme.breakpoints.up('md')]: { maxWidth: 1000 },
    marginBottom: theme.spacing.unit * 5,
  },
})

export default styles
