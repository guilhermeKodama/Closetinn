const styles = theme => ({
  content: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 3,
    },
  },
  product: {
    marginBottom: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    objectFit: 'contain',
    marginRight: theme.spacing.unit,
  },
})

export default styles
