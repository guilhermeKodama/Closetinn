
const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    margin: '0 auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('md')]: { marginBottom: 500 },
    [theme.breakpoints.up('lg')]: { maxWidth: 1440 },
    color: 'white',
  },
  contentColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logout: {
    width: '100px',
    float: 'right'
  },
  profileImage: {
    marginBottom: '10px',
    height: '50px',
    width: '50px',
    float: 'left'
  },
  formGroup: {
    marginBottom: '10px !important',
    '&:input': {
      height: '36px',
      fontFamily: 'Avenir Next',
    	fontSize: '14px',
      borderRadius: '0px',
      border: 'solid 1px #979797R'
    },
    '&:input::placeholder': {
      fontFamily: 'Avenir Next',
    	fontSize: '14px',
      color: '#bbbbbb'
    }
  },
  button: {
    width: '100%',
    height: '36px',
    backgroundColor: '#2b2c35',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#f4f4f4',
    borderRadius: '0px',
    border: 0,
    '&:hover': {
      backgroundColor: '#2b2c35',
      color: '#f4f4f4'
    },
    '&:focus': {
      backgroundColor: '#2b2c35 !important',
      color: '#f4f4f4 !important',
      outline: '0 !important'
    }
  }
})

export default styles
