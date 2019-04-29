const styles = theme => ({
  root: {},
  title: {
    color: theme.palette.common.black,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'black',
  },
  grid: {
    marginTop: theme.spacing.unit * 2,
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing.unit * 5,
    },
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
  },
  actions: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
  },
  pagination: {
    marginTop: theme.spacing.unit * 2,
  },
  caption: {
    color: theme.palette.common.black,
    [theme.breakpoints.up('sm')]: { fontSize: 18 },
  },
  select: {
    color: theme.palette.common.black,
    [theme.breakpoints.up('sm')]: { fontSize: 18 },
  },
})

export default styles
