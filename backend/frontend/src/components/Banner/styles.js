const styles = theme => ({
  root: {
    position: 'relative',
    maxWidth: 1440,
    maxHeight: 320,
    [theme.breakpoints.up('md')]: {
      maxHeight: 500,
    },
    overflow: 'hidden',
  },
  image: {
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(69, 69, 69, 0.4)',
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing.unit * 10}px ${theme.spacing.unit * 5}px`,
    [theme.breakpoints.up('lg')]: {
      padding: `${theme.spacing.unit * 15}px ${theme.spacing.unit * 20}px`,
    },
  },
  label: {
    maxHeight: 320,
    color: 'white',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    [theme.breakpoints.up('sm')]: { fontSize: 32 },
    [theme.breakpoints.up('md')]: {
      maxHeight: 500,
      fontSize: 40,
    },
    [theme.breakpoints.up('lg')]: { fontSize: 45 },
  },
  button: {
    marginTop: theme.spacing.unit * 3,
  },
})

export default styles
