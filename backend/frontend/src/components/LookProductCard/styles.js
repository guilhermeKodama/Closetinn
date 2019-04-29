const lineHeight = 20

const styles = theme => ({
  root: {
    position: 'relative',
    maxWidth: theme.spacing.unit * 25,
    [theme.breakpoints.up('md')]: { maxWidth: theme.spacing.unit * 41 },
    '&:hover': {
      cursor: 'pointer',
    },
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  media: {
    height: theme.spacing.unit * 36,
    [theme.breakpoints.up('md')]: { height: theme.spacing.unit * 60 },
  },
  content: {
    padding: theme.spacing.unit,
    backgroundColor: 'white',
  },
  productName: {
    lineHeight: `${lineHeight}px`,
    height: lineHeight * 2,
    overflow: 'hidden',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: theme.spacing.unit * 7,
    padding: theme.spacing.unit,
    background: '#333333',
    color: 'white',
  },
  text: {
    color: 'black',
  },
  strikethrough: {
    color: 'black',
    textDecoration: 'line-through',
  },
})

export default styles
