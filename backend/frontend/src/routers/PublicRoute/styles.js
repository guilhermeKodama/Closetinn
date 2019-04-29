const styles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: 'inherit',
  },
  background: {
    background: 'url(images/background.jpg)',
    backgroundSize: 'cover',
    zIndex: theme.zIndex.mobileStepper - 2,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.65)',
    zIndex: theme.zIndex.mobileStepper - 1,
  },
  '#root': {
    height: '100%',
  }
})

export default styles
