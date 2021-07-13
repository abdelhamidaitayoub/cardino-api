// ! maybe i don't need this model

const mongoose = require('mongoose');

const cardTagSchema = new mongoose.Schema({
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card'
  },
  Tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  },
});

const CardTag = mongoose.model('CardTag', cardTagSchema);

module.exports = CardTag;
