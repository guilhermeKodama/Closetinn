const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    margin: '0 auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('lg')]: { maxWidth: 1440 },
  },
  tabsRoot: {},
  tabsIndicator: {
    backgroundColor: '#2f334c',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#4a4a4a',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#2b2c35',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#2b2c35',
    },
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3,
  },
  grid: {
    marginTop: 40
  }
})

export default styles
