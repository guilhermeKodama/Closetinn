const styles = theme => ({
  root: {
    color: 'white',
  },
  look: {
    position: 'relative',
    [theme.breakpoints.up('md')]: { marginBottom: theme.spacing.unit * 80, },
  },
  lookCard: {
    marginBottom: theme.spacing.unit,
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      width: 'auto',
      position: 'absolute',
      top: '80%',
      left: '8%',
      justifyContent: 'left',
    },
  },
})

export default styles
