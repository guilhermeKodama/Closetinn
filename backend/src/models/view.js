import mongoose from '/src/db/mongoose'

var ViewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  url: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
})

const View = mongoose.model('View', ViewSchema, 'views')

export default View
