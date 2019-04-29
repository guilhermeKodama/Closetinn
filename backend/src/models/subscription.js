import validator from 'validator'
import User from '/src/models/user'
import mongoose from '/src/db/mongoose'

var SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscribed: {
    type: Boolean,
    required: true
  },
  reasons: {
    type: Array
  },
  suggestion: {
    type: String
  }
}, {
  timestamps: true
})

const Subscription = mongoose.model('Subscription', SubscriptionSchema, 'subscriptions')

module.exports = Subscription
