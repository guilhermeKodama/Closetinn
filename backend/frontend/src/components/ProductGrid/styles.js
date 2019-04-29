const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
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
