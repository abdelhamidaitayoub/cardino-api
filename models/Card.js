const mongoose = require('mongoose');
const slugify = require('slugify');
const randomString = require('randomstring');
const readingTime = require('reading-time');

const slug = function () {
  return `${slugify(this.title)}-${randomString.generate(4)}`;
};

const URL = 'http://localhost:8000/images/cards/';

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A Card must have a title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      // set: slug,
      default: slug,
    },
    cover: {
      type: String,
      get: function (v) {
        return `${URL}${v}`;
      }
    },
    images: [String],
    md: String,
    render: String,
    readingTime: {
      type: String,
      set: function () {
        return readingTime(this.md).text;
      },
      default: function () {
        return readingTime(this.md).text;
      },
    },
    viewsCount: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length <= 4;
        },
        message: 'exceed the maximum of 4 tags',
      },
    },

    published: {
      type: Boolean,
      default: true,
    },
    publishedAt: Date,
  },
  { timestamps: true, toJSON: { getters: true } }
);

//
// MEDLLEWARES
//
cardSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user' });
  next();
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
