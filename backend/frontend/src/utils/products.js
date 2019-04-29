export const checkDisabledProducts = products => {
  return products.reduce((total, current) => {
    return current.disabled ? total =+ 1 : total
  }, 0)
}
