import numeral from 'numeral'

numeral.register('locale', 'br', {
  delimiters: {
      thousands: '.',
      decimal: ','
  },
  abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't'
  },
  ordinal : function (number) {
      return number === 1 ? 'o' : 'a';
  },
  currency: {
      symbol: 'R$'
  }
})

// switch between locales
numeral.locale('br')
numeral.defaultFormat('$ 0,0.00')

export { numeral }

export function arrayToObject(array) {
  return array.reduce((obj, item) => {
    obj[item._id.toString()] = item
    return obj
  }, {})
}

export function isValidName(name) {
  if (name === null) return false
  const length = name.length
  return length > 0 ? true : false
}

export function isValidEmail(email) {
  if (email === null) return false
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
  return re.test(email)
}

export function isValidPassword(password) {
  if (password === null) return false
  const length = password.length
  return length > 5 ? true : false
}

export function isValidPasswordConfirmation(password, passwordConfirmation) {
  if (passwordConfirmation === null) return false
  return (isValidPassword(passwordConfirmation) && password === passwordConfirmation)
}
