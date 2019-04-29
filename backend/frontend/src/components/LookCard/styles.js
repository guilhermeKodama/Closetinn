const styles = theme => ({
  root: {
    position: 'relative',
    maxWidth: theme.spacing.unit * 28,
    '&:hover': { cursor: 'pointer' },
  },
  media: {
    height: 0,
    paddingTop: '100%',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 0,
  },
  productName: {
    fontWeight: 'bold',
    lineHeight: '20px',
    maxHeight: 20 * 2,
    overflow: 'hidden',
  },
})

export default styles
