const styles = theme => ({
  root: {
    maxWidth: 1440,
    maxHeight: 320,
    [theme.breakpoints.up('md')]: {
      maxHeight: 500,
    },
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    display: 'flex',
    color: 'white',
  },
  image: {
    overflow: 'hidden',
    objectFit: 'cover',
  },
  label: {
    maxHeight: 320,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    fontSize: 28,
    fontWeight: 'bold',
    padding: `${theme.spacing.unit * 10}px ${theme.spacing.unit * 5}px`,
    [theme.breakpoints.up('sm')]: { fontSize: 32 },
    [theme.breakpoints.up('md')]: {
      maxHeight: 500,
      fontSize: 40,
    },
    [theme.breakpoints.up('lg')]: {
      padding: `${theme.spacing.unit * 15}px ${theme.spacing.unit * 20}px`,
      fontSize: 45,
    },
  },
  stepper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 2,
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing.unit * 5,
    },
  },
  dot: {
    width: 14,
    height: 14,
    margin: `0 ${theme.spacing.unit}px`,
    objectFit: 'contain',
    backgroundColor: 'white',
    border: 'solid 3px black',
  },
  dotActive: {
    width: 14,
    height: 14,
    objectFit: 'contain',
    backgroundColor: 'black',
  },
})

export default styles
