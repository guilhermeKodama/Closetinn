import mongoose from '/src/db/mongoose'

var RecommendationPromotionsHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false,
  },
  promotions: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cloth',
    }],
  },
  biggestDiscount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cloth'
  },
  score: {
    type: mongoose.Schema.Types.Mixed,
    select: false,
  },
}, {
  timestamps: true
})

const RecommendationPromotionsHistory = mongoose.model('RecommendationPromotionsHistory', RecommendationPromotionsHistorySchema, 'recommendationPromotionsHistory')

module.exports = RecommendationPromotionsHistory
