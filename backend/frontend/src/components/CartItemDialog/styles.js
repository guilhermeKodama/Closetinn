const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
  },
  button: {
    width: theme.spacing.unit * 3,
    height: theme.spacing.unit * 3,
  },
  cardContent: {
    display: 'flex',
    alignItems: 'start',
    width: '100%',
    padding: '0 0',
    '&:last-Child': {
      padding: 0,
    },
  },
  contentRow: {
    display: 'flex',
  },
  cardMedia: {
    width: 100,
    height: 100,
    objectFit: 'cover',
    marginTop: theme.spacing.unit / 2,
  },
  cardDetails: {
    width: '100%',
    padding: `0 ${theme.spacing.unit}px 0 ${theme.spacing.unit}px`,
    textTransform: 'capitalize',
  },
  textField: {
    width: 80,
    padding: `0 ${theme.spacing.unit}px 0 ${theme.spacing.unit}px`,
  },
})

export default styles
