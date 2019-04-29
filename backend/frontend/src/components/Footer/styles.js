const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 8,
    background: 'none',
    color: 'white',
    zIndex: theme.zIndex.appBar,
  },
  wrapper: {
    display: 'flex',
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.up('md')]: { padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 10}px` },
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: { justifyContent: 'space-between' },
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: { justifyContent: 'flex-end' },
  },
  title: {
    padding: `0 ${theme.spacing.unit * 6}px`,
    [theme.breakpoints.up('md')]: { padding: 0 },
  },
  rights: {
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing.unit * 3,
    },
    color: theme.palette.common.white,
  },
  content: {
    maxWidth: 1440,
    margin: '0 auto',
  },
  link: {
    color: 'inherit',
    '&:hover': {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
  iconLink: {
    marginLeft: theme.spacing.unit * 3,
    fill: 'white',
  },
  closetinn: {
    marginBottom: theme.spacing.unit * 2,
  },
  typography: {
    marginBottom: theme.spacing.unit * 2,
  },
  bold: {
    fontWeight: 'bold',
  },
})

export default styles
