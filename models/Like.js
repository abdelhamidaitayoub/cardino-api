const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  type: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
}, { timestamps: true });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
