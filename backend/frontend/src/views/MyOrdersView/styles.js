const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    margin: '0 auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('lg')]: {
      maxWidth: 1440,
    },
  },
  grid: {
    display: 'flex',
    alignItems: 'center',
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  card: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 275,
    },
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  }
})

export default styles
