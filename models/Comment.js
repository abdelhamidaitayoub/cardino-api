const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentBody: String,
  likesCount: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card'
  },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
