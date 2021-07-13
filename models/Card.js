const mongoose = require('mongoose');
const slugify = require('slugify');
const randomString = require('randomstring');

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
   },
   slug: {
     type: String,
     required: true,
     default: function() {
       return `${slugify(this.title)}-${randomString.generate(7)}`;
     },
   },
  type: {
    type: String,
  },
  cover: String,
  images: [String],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  cardBody: String,
  readingTime: String,
  viewsCount: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
},{timestamps: true});

// cardSchema.virtual('slug').get(function() {
//   return `${slugify(this.title)}-${randomString.generate(7)}`;
// });

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
