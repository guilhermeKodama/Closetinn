import mongoose from '/src/db/mongoose'

var RecommendationLooksHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false,
  },
  looks: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Look',
    }],
  },
}, {
  timestamps: true
})

const RecommendationLooksHistory = mongoose.model('RecommendationLooksHistory', RecommendationLooksHistorySchema, 'recommendationLooksHistory')

module.exports = RecommendationLooksHistory
