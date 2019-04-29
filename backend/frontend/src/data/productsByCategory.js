import products from './products'

// collapse and index products by category

const productsByCategory = {
  '1': products.slice(0,10),
  '2': products.slice(10,20),
  '3': products.slice(20,30),
  '4': products.slice(30,40),
  '5': products.slice(40,50),
  '6': products.slice(0,10),
  '7': products.slice(10,20),
  '8': products.slice(20,30)
}

export default productsByCategory
