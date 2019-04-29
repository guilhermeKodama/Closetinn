import validator from 'validator'
import { ObjectID } from 'mongodb'
import Cloth from '/src/models/cloth'
import mongoose from '/src/db/mongoose'

var CartSchema = new mongoose.Schema({
  anonymousId: {
    type: String,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  products: [
    {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      size: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ],
  address: {
    type: mongoose.Schema.Types.Mixed,
    postcode: { type: String, required: true },
    street: { type: String, required: true },
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    streetNumber: { type: String, required: true },
    complement: { type: String },
    reference: { type: String, required: true },
    phone: { type: String, required: true },
  },
  creditCard: {
    type: mongoose.Schema.Types.Mixed,
    number: { type: String, required: true },
    holder: { type: String, required: true },
    expirationMonth: { type: Number, required: true },
    expirationYear: { type: Number, required: true },
    securityCode: { type: String, required: true },
  },
  totalProductsPrice: { type: Number, default: 0 },
  deliveryPrice: { type: Number, default: 0 },
  deliveryTime: { type: String },
  totalPrice: { type: Number, default: 0 }
}, {
  timestamps: true
})

CartSchema.statics.mergeAnonymousCart = async (anonymousId, userId) => {
  const anonymousCart = await Cart.findOne({ anonymousId })
  let userCart = await Cart.findOne({ user: new ObjectID(userId) })
  // if both have carts let's merge them
  if(userCart && anonymousCart) {
    for(let i = 0; i < anonymousCart.products.length; i ++) {
      let hasSameProduct = false
      let sameProductIndex = null
      const productA = anonymousCart.products[i]

      for(let j = 0; j < userCart.products.length; j ++) {
        const productU = userCart.products[j]
        if(productA._id === productU._id && productA.size === productU.size) {
          hasSameProduct = true
          sameProductIndex = j
        }
      }

      if(hasSameProduct) {
        userCart.products[sameProductIndex].quantity = userCart.products[sameProductIndex].quantity + 1
      } else {
        userCart.products.push(productA)
      }
    }

    const { __v, ...data } = userCart.toJSON()
    data.anonymousId = anonymousId
    return await Cart.findOneAndUpdate({ user: new ObjectID(userId) }, data, { new: true, upsert: true })

  } else if(!userCart && anonymousCart) {
    const { products, address, creditCard } = anonymousCart
    userCart = { products, address, creditCard, user: userId, anonymousId }
    await Cart.findOneAndRemove({ anonymousId })
    return await Cart.findOneAndUpdate({ user: new ObjectID(userId) }, userCart, { new: true, upsert: true })

  } else if(!userCart && !anonymousCart) {
    return await Cart.create({ user: new ObjectID(userId), products: [] })

  } else if(userCart && !anonymousCart) {
    return userCart

  }
}

CartSchema.methods.fetchProducts = async function () {
  let cart = this
  for(let i = 0; i < cart.products.length; i++) {
    const product = cart.products[i]
    const cloth = await Cloth.findOne({ _id: new ObjectID(product._id) })
    cart.products[i] = { ...cloth.toJSON(), size: product.size, quantity: product.quantity}
  }
}

CartSchema.set('toJSON', {
  transform: function(doc, ret) {
    if(ret.creditCard) {
      const length = ret.creditCard.number.length
      ret.creditCard.number = '**** **** **** ' + ret.creditCard.number.substring(length - 4, length)
    }
    delete ret.__v
  }
})

CartSchema.statics.updateCost = async (cart) => {
  cart.deliveryPrice = cart.deliveryPrice || 0
  cart.totalProductsPrice = 0
  cart.totalPrice = 0
  if(cart.products) {
    for(let i = 0; i < cart.products.length; i++) {
      const product = cart.products[i]
      const cloth = await Cloth.findOne({ _id: new ObjectID(product._id) })
      cart.totalProductsPrice += cloth.price * product.quantity
    }
    cart.totalPrice = cart.totalProductsPrice + cart.deliveryPrice
  }
  return cart
}

const Cart = mongoose.model('Cart', CartSchema, 'cart')

module.exports = Cart
