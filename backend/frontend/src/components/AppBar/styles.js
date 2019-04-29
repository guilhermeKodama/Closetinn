const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  toolbar: {
    margin: '0 auto',
    width: '100%',
    maxWidth: 1440,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
  },
  input: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, .15)',
    padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 2}px`,
    borderRadius: 2,
  },
  toolbarButton: {
    '&:hover, &:active, &:visited, &:focus': {
      color: 'inherit',
      textDecoration: 'none',
      outline: 'none',
    },
  },
  avatar: {
    cursor: 'pointer',
    margin: theme.spacing.unit,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  menuButton: {
    '&:hover, &:active, &:visited, &:focus': {
      color: 'inherit',
      textDecoration: 'none',
      outline: 'none',
    },
    marginRight: 20,
  },
  title: {
    flex: '0 1 auto',
    textTransform: 'uppercase',
    fontWeight: 900,
    textOverflow: 'ellipsis',
    '&:hover, &:active, &:visited, &:focus': {
      color: 'inherit',
      textDecoration: 'none',
      outline: 'none',
    },
  },
  profileTitle: {
    fontWeight: 600,
  },
  spacer: {
    flex: '1 1 auto',
  },
})

export default styles
