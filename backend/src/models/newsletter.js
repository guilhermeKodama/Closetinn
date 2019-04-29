import validator from 'validator'
import mongoose from '/src/db/mongoose'

var NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

const Newsletter = mongoose.model('Newsletter', NewsletterSchema, 'newsletters')

module.exports = Newsletter
