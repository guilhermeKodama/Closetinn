const styles = theme => ({
  root: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'row',
    },
  },
  card: {
    flex: '1 1 auto',
    maxWidth: theme.spacing.unit * 103,
    '&:hover': {
      cursor: 'pointer',
    },
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  details: {
    color: 'black',
    display: 'flex',
    maxWidth: theme.spacing.unit * 103,
    [theme.breakpoints.up('md')]: { flexDirection: 'column' },
  },
  media: {
    height: 0,
    paddingTop: '100%',
  },
  content: {
    flex: '1 1 auto',
    [theme.breakpoints.up('md')]: { flex: '0 1 auto' },
  },
  actions: {
    padding: theme.spacing.unit,
    color: 'white',
  },
})

export default styles
