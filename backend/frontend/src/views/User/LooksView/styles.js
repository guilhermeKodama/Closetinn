const styles = theme => ({
  root: {
    color: 'white',
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing.unit* 2}px)`,
    color: 'white',
  },
  grid: {
    flexGrow: 1,
  }
})

export default styles
