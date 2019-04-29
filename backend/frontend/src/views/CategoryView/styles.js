const styles = theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    margin: '0 auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('lg')]: { maxWidth: 1440 },
  },
  toolbar: theme.mixins.toolbar,
  grid: {
    height: '100%',
  },
  progress: {
    position: 'fixed',
    zIndex: theme.zIndex.drawer,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})

export default styles
