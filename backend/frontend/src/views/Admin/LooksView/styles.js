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
  card: {
    flex: '1 1 auto',
    maxWidth: theme.spacing.unit * 30,
    '&:hover': {
      cursor: 'pointer',
    },
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  media: {
    height: 0,
    paddingTop: '100%',
  },
  badge: {
    top: -1,
    right: -25,
  }
})

export default styles
