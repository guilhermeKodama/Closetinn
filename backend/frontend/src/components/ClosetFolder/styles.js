const styles = theme => ({
  card: {
    cursor: 'pointer',
    width: 200,
    height: 200,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150
  }
})

export default styles
