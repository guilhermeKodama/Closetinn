import validator from 'validator'
import { ObjectID } from 'mongodb'
import fs from 'fs'
import path from 'path'
import Mustache from 'mustache'

import mongoose from '/src/db/mongoose'
import Cloth from '/src/models/cloth'
import email from '../utils/email'

var PurchaseOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: Number,
    required: true
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
        required: true
      }
    }
  ],
  address: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
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
    required: true,
    type: mongoose.Schema.Types.Mixed,
    number: { type: String, required: true },
    holder: { type: String, required: true },
    expirationMonth: { type: Number, required: true },
    expirationYear: { type: Number, required: true },
    securityCode: { type: String, required: true },
  },
  status: {
    required: true,
    type: String,
    enum: ['enqueue', 'progress', 'failed', 'complete', 'cancel'],
    default: 'enqueue'
  },
  numAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  processingErrors: {
    type: [{
      type: mongoose.Schema.Types.Mixed,
      attempt: { required: true, type: Number, default: 1 },
      datetime: { required: true, type: Date, default: Date.now }
    }],
    default: []
  },
  totalProductsPrice: { type: Number, default: 0 },
  deliveryPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 }
}, {
  timestamps: true
})

PurchaseOrderSchema.methods.fetchProducts = async function () {
  let po = this
  for(let i = 0; i < po.products.length; i++) {
    const product = po.products[i]
    const cloth = await Cloth.findOne({ _id: new ObjectID(product._id) })
    po.products[i] = { ...cloth.toJSON(), size: product.size, quantity: product.quantity, subtotal: cloth.toJSON().price * product.quantity}
  }
}

PurchaseOrderSchema.set('toJSON', {
  transform: function(doc, ret) {
    if(ret.creditCard) {
      const length = ret.creditCard.number.length
      ret.creditCard.number = '**** **** **** ' + ret.creditCard.number.substring(length - 4, length)
    }
    delete ret.__v
  }
})

PurchaseOrderSchema.methods.sendConfirmationEmail = async function (userEmail) {
  let po = this

  const template = fs.readFileSync(path.join(__dirname, '../utils/template.mst'), 'utf8')
  Mustache.parse(template) // optional, speeds up future uses
  var rendered = Mustache.render(template, po)

  const options = {
    from: 'nao-responda@closetinn.com.br',
    to: userEmail,
    subject: 'Recebemos o seu pedido \u{1F60A}',
    html: rendered
  }

  const result = email.sendEmail(options)

  return Promise.resolve(result)
}

const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema, 'purchaseOrders')

module.exports = PurchaseOrder
