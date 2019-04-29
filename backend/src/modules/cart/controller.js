import { ObjectID } from 'mongodb'
import Cloth from '/src/models/cloth'
import Cart from '/src/models/cart'
import User from '/src/models/user'
import validators from '/src/middleware/validators'
import {
  isSouth,
  isSoutheast,
  isDF,
  isMidwest,
  isNortheast,
  isNorth,
  calculateDelivery
} from './utils'

module.exports = {
  /**
    * @api {post} /cart Create cart
    * @apiVersion 1.0.0
    * @apiName Cart
    * @apiGroup Cart
    * @apiPermission none
    *
    * @apiDescription Add cloth to cart
    */
  createCart: async (req, res, next) => {
    try {
      const { anonymousId } = req.body
      const cart = await Cart.create({ anonymousId, products: [], totalProductsPrice: 0, totalPrice: 0, deliveryPrice: 0 })
      await cart.fetchProducts()

      return res.json(cart)
    } catch(error) {
      console.log('ERROR:', error)
      res.status(500).send({ error: error && error.message })
    }
  },
  /**
    * @api {post} /cart/:id/product Add cloth to cart
    * @apiVersion 1.0.0
    * @apiName Cart
    * @apiGroup Cart
    * @apiPermission none
    *
    * @apiDescription Add cloth to cart
    */
  addClothToCart: async (req, res, next) => {
    try {
      const { id } = req.params
      const cart = await Cart.findOne({ _id: new ObjectID(id) })

      // init before checks
      let data = { products: null }

      if (cart) {
        const { _id, size, quantity } = req.body.product
        // check if product already exist in cart
        for(let i = 0; i < cart.products.length; i ++) {
          let product = cart.products[i]
          if (product._id === _id && product.size === size) {
            cart.products[i].quantity = cart.products[i].quantity + 1
            data.products = cart.products
            break
          }
        }

        if(!data.products) {
          cart.products.push(req.body.product)
          data.products = cart.products
        }
      } else {
        data.products = [ req.body.product ]
      }

      data = await Cart.updateCost(data)

      const updatedCart = await Cart.findOneAndUpdate({ _id: new ObjectID(id) },
        data,
        { new: true, upsert: true })

      await updatedCart.fetchProducts()

      return res.send({ ...updatedCart.toJSON() })
    } catch(error) {
      console.log('ERROR:', error)
      res.status(500).send({ error: error && error.message })
    }
  },
  /**
    * @api {get} /cart/:id Get cart info
    * @apiVersion 1.0.0
    * @apiName Cart
    * @apiGroup Cart
    * @apiPermission none
    *
    * @apiDescription Get cart info
    */
  getCart: async (req, res, next) => {
    try {
      const cart = await Cart.findOne({ _id: new ObjectID(req.params.id) })

      if(!cart) return res.status(404).send({ error: 'Cart not found!' })

      await cart.fetchProducts()

      res.send({ ...cart.toJSON() })
    } catch(error) {
      console.log('ERROR:', error)
      res.status(500).send({ error: error && error.message })
    }
  },
  /**
    * @api {put} /cart/:id/product/:productId Update product order info in shopping cart
    * @apiVersion 1.0.0
    * @apiName Cart
    * @apiGroup Cart
    * @apiPermission none
    *
    * @apiDescription Update product order info in shopping cart
    */
  updateCartProductOrder: async (req, res, next) => {
    try {
      let cart = await Cart.findOne({ _id: new ObjectID(req.params.id) })

      if(!cart) return res.status(404).send({ error: 'Cart not found!' })

      const { productId } = req.params
      const { newSize, size, quantity } = req.body.product

      for(let i = 0; i < cart.products.length; i ++) {
        let product = cart.products[i]
        if (product._id === productId && product.size === size) {

          cart.products[i].size = newSize
          cart.products[i].quantity = quantity

          cart = await Cart.updateCost(cart)

          const updatedCart = await Cart.findOneAndUpdate({ _id: new ObjectID(req.params.id) },
            {
              products: cart.products,
              totalPrice: cart.totalPrice,
              totalProductsPrice: cart.totalProductsPrice,
              deliveryPrice: cart.deliveryPrice
            },
            { new: true })

          await updatedCart.fetchProducts()

          return res.send({ ...updatedCart.toJSON() })
        }
      }

      return res.status(404).send({ error: 'Product not found!' })
    } catch(error) {
      console.log('ERROR:', error)
      res.status(500).send({ error: error && error.message })
    }
  },
  /**
    * @api {delete} /cart/:id/product/:productId Delete product order info from cart
    * @apiVersion 1.0.0
    * @apiName Cart
    * @apiGroup Cart
    * @apiPermission none
    *
    * @apiDescription Delete product order info from cart
    */
  removeProductFromCart: async (req, res, next) => {
    try {
      const { id, productId } = req.params
      let cart = await Cart.findOne({ _id: new ObjectID(id) })

      if(!cart) return res.status(404).send({ error: 'Cart not found!' })

      for(let i = 0; i < cart.products.length; i ++) {
        let product = cart.products[i]
        if (product._id === productId && product.size === req.body.product.size) {
          cart.products.splice(i, 1)
          break
        }
      }

      cart = await Cart.updateCost(cart)

      const updatedCart = await Cart.findOneAndUpdate({ _id: new ObjectID(id) },
        {
          products: cart.products,
          totalPrice: cart.totalPrice,
          totalProductsPrice: cart.totalProductsPrice,
          deliveryPrice: cart.deliveryPrice
        },
        { new: true })

      await updatedCart.fetchProducts()

      return res.send({ ...updatedCart.toJSON() })
    } catch(error) {
      console.log('ERROR:', error)
      res.status(500).send({ error: error && error.message })
    }
  },
    /**
      * @api {put} /cart/:id Update cart address and cc info
      * @apiVersion 1.0.0
      * @apiName Cart
      * @apiGroup Cart
      * @apiPermission none
      *
      * @apiDescription Update cart address and cc info
      */
    updateCart: async (req, res, next) => {
      try {
        if(!ObjectID.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id!'})

        let cart = await Cart.findOne({ _id: new ObjectID(req.params.id) })

        if(!cart) return res.status(404).send({ error: 'Cart not found!' })

        const data = {}
        if(req.body.address) {
          data.address = req.body.address
          // calculate deliveryPrice

          /* Dafiti logic */
          const { state, city } = data.address

          const result = await calculateDelivery(data.address.postcode)

          if(result.length > 0) {
            if ((isSouth(state) || isSoutheast(state) || isDF(state)) && cart.totalProductsPrice >= 99) {
              data.deliveryPrice = 0
            } else if ((isMidwest(state) || isNortheast(state)) && cart.totalProductsPrice >= 149) {
              data.deliveryPrice = 0
            } else if (isNorth(state) && cart.totalProductsPrice >= 199) {
              data.deliveryPrice = 0
            } else {
              data.deliveryPrice = parseFloat(result[0].Valor)
            }

            data.deliveryTime = result[0].PrazoEntrega
            cart.deliveryPrice = data.deliveryPrice

            const { totalPrice, totalProductsPrice } = await Cart.updateCost(cart)
            data.totalPrice = totalPrice
            data.totalProductsPrice = totalProductsPrice
          } else {
            return res.status(504).send({ error: 'Error trying to calculate the delivery price!' })
          }
        }

        if(req.body.creditCard) data.creditCard = req.body.creditCard

        const updatedCart = await Cart.findOneAndUpdate({ _id: new ObjectID(req.params.id) },
          data,
          { new: true })

        await updatedCart.fetchProducts()

        return res.json({ ...updatedCart.toJSON() })
      } catch(error) {
        console.log('ERROR:', error)
        res.status(500).send({ error: error && error.message })
      }
    }
}
