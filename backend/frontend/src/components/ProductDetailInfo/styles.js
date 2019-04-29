const styles = theme => ({
  mobileStepper: {
    position: 'unset',
    display: 'flex',
    justifyContent: 'center',
    background: 'white',
  },
  gridItem: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: 'white',
  },
  actions: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing.unit,
  },
  labels: {
    marginTop: theme.spacing.unit,
    [theme.breakpoints.up('sm')]: {
      marginTop: 0,
      marginLeft: theme.spacing.unit * 2,
    },
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  title: {
    textTransform: 'uppercase',
  },
  unavailable: {
    width: 115,
    padding: '0 5px',
    fontSize: 12,
    textAlign: 'center',
    borderRadius: 3,
    background: '#d8d8d8',
  },
  formControl: {
    marginBottom: theme.spacing.unit * 2,
  },
  list: {
    padding: 0,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
  button: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
})

export default styles
