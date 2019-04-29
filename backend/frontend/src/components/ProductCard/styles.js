const styles = theme => ({
  root: {
    position: 'relative',
    maxWidth: theme.spacing.unit * 28,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  cardHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  cardMedia: {
    height: 0,
    paddingTop: '100%',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 0,
  },
  productName: {
    fontWeight: 'bold',
    lineHeight: '20px',
    maxHeight: 20 * 2,
    overflow: 'hidden',
  },
  unavailable: {
    width: 115,
    padding: '0 5px',
    fontSize: 12,
    textAlign: 'center',
    borderRadius: 3,
    background: '#d8d8d8',
  },
  strikethrough: {
    textDecoration: 'line-through',
  },
})

export default styles
