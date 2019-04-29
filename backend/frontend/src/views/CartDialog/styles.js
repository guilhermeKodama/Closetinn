const styles = theme => ({
  root: {
    WebkitOverflowScrolling: 'touch',
  },
  toolbarTitle: {
    flex: 1,
  },
  total: {
    paddingRight: theme.spacing.unit * 2,
  },
  divider: {
    marginLeft: theme.spacing.unit * 5,
  },
  listItem: {
    padding: 0,
    paddingBottom: theme.spacing.unit,
  },
  card: {
    width: '100%',
    padding: `0 ${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 5}px`,
  },
  cardContent: {
    padding: 0,
    '&:last-child': {
      padding: 0,
    }
  },
  contentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default styles
