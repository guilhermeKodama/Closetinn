const styles = theme => ({
  root: {
    flex: 1,
    [theme.breakpoints.up('sm')]: { maxWidth: 1440 },
    zIndex: theme.zIndex.drawer,
  },
  grid: {
    height: '100%',
    padding: theme.spacing.unit * 3,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: theme.spacing.unit * 48,
    [theme.breakpoints.up('md')]: { maxWidth: theme.spacing.unit * 40 },
    color: 'white',
  },
  link: {
    color: 'white',
    '&:visited': { background: 'white' },
  },
  facebookButton: {
    background: 'rgba(59, 89, 152, .95)',
    '&:hover': { background: '#3b5998' },
    marginBottom: theme.spacing.unit,
  },
  button: {
    marginBottom: theme.spacing.unit,
  },
})

export default styles
