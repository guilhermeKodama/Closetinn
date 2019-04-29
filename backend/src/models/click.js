import validator from 'validator'
import User from '/src/models/user'
import Cloth from '/src/models/cloth'
import Look from '/src/models/look'
import mongoose from '/src/db/mongoose'

var ClickSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cloth'
  },
  look: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Look'
  },
  event: {
    type: String,
    required: true,
    enum: [
      'PRODUCT_CLICK',
      'LOOK_CLICK',
      'EMAIL_LOOK_RECOMMENDATION_CLICK',
      'EMAIL_PROMOTION_RECOMMENDATION_CLICK',
      'EMAIL_UNSUBSCRIBE_CLICK',
      'PRODUCT_LIKE',
      'PRODUCT_DISLIKE',
      'LOOK_LIKE',
      'LOOK_DISLIKE',
      'UNSUBSCRIBE_CLICK'
    ]
  },
  url: {
    type: String
  }
}, {
  timestamps: true
})

const Click = mongoose.model('Click', ClickSchema, 'clicks')

module.exports = Click
