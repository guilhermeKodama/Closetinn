export function objectToParams(object) {
  const params = Object.keys(object).reduce((initialValue, key) => {
    let encoded = Array.isArray(object[key]) ? JSON.stringify(object[key].map(value => encodeURIComponent(value))) : object[key]
    return initialValue + (object[key] ? `&${key}=${encoded}` : '')
  }, '')

  return params
}
