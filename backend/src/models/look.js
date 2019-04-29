import validator from 'validator'
import { ObjectID } from 'mongodb'
import Cloth from '/src/models/cloth'
import mongoose from '/src/db/mongoose'

var LookSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    unique: true
  },
  products: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cloth' }],
  }
}, {
  timestamps: true
})

const Look = mongoose.model('Look', LookSchema, 'looks')

module.exports = Look
