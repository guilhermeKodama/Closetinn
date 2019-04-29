const styles = theme => ({
  root: {
    position: 'relative',
    width: '100%',
    maxWidth: theme.spacing.unit * 46,
    maxHeight: theme.spacing.unit * 57,
    '&:hover': {
      cursor: 'pointer',
    },
    [theme.breakpoints.up('md')]: {
      maxHeight: theme.spacing.unit * 77,
    },
  },
  card: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    background: 'rgb(51, 51, 51)',
    width: theme.spacing.unit * 12,
    height: theme.spacing.unit * 12,
  },
  topLabel: {
    color: 'white',
    fontSize: 22,
    fontWeight: 500,
  },
  cardMedia: {
    height: theme.spacing.unit * 40,
    [theme.breakpoints.up('md')]: {
      height: theme.spacing.unit * 60,
    },
  },
  media: {
    backgroundSize: 'contain',
  },
  cardContent: {
    padding: theme.spacing.unit,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center',
    padding: `0 ${theme.spacing.unit}px ${theme.spacing.unit * 3}px ${theme.spacing.unit}px`,
  },
})

export default styles
