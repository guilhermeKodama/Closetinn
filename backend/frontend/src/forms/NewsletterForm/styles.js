const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 600,
  },
  input: {
    color: 'white',
  },
  button: {
    marginLeft: theme.spacing.unit,
    background: 'rgba(69, 69, 69, .95)',
    '&:hover': {
      background: 'rgba(69, 69, 69)',
    },
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
})

export default styles
