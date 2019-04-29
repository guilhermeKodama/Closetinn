const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    margin: '0 auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('lg')]: {
      maxWidth: 1440,
    },
  },
  toolbar: theme.mixins.toolbar,
  list: {
    padding: 0,
  },
  divider: {
    marginLeft: theme.spacing.unit * 5,
    marginBottom: theme.spacing.unit,
  },
  listItem: {
    padding: 0,
    paddingBottom: theme.spacing.unit,
  },
  card: {
    width: '100%',
    minWidth: 304,
    padding: `0 ${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 2}px`,
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
  grid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  item: {
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    marginTop: 20
  },
  lookImage: {
    height: 200,
    width: 150,
    objectFit: 'cover'
  },
  dropzoneContainer: {
    display: 'flex'
  }
})

export default styles
