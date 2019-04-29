const styles = theme => ({
  root: {
    position: 'sticky',
    top: theme.spacing.unit * 8,
    borderBottom: '0.5px solid rgba($charcoal-grey, 0.5)',
    background: 'white',
    zIndex: 10,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    height: theme.spacing.unit * 8,
    maxWidth: 1440,
    background: 'white',
  },
  grid: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 6}px`,
  },
  gridItem: {
    maxWidth: theme.spacing.unit * 30,
    width: theme.spacing.unit * 30,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  category: {
    marginBottom: theme.spacing.unit * 2,
    fontWeight: 900,
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  subcategory: {
    marginBottom: theme.spacing.unit,
    fontWeight: 400,
    cursor: 'pointer',
  }
})

export default styles
