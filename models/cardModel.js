const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  slug: {
    type: String,
  },
  type: { type: String },
  cardBody: String,
  comments: [String],
  commentsCount: Number,
  tags: [String],
  tagsCount: Number,
  likes: Number,
  views: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: Date,
});

cardSchema.statics.findByTitle = function(title) {
  console.log('form'+title);
}

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
