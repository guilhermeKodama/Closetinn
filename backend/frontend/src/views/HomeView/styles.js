const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    margin: '0 auto',
    paddingBottom: theme.spacing.unit * 2,
    [theme.breakpoints.up('lg')]: { maxWidth: 1440 },
  },
  toolbar: theme.mixins.toolbar,
  promotionGrid: {
    marginTop: theme.spacing.unit * 5,
    padding: `0 ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.up('lg')]: {
      marginTop: theme.spacing.unit * 12,
    },
  },
  banner: {
    marginTop: theme.spacing.unit * 5,
    [theme.breakpoints.up('lg')]: {
      marginTop: theme.spacing.unit * 12,
    },
  },
})

export default styles
