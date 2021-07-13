const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  description: {
    type: String,
  },
  badge: String,
  color: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
},{timestamps: true});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
