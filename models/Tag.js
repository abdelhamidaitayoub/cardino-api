const mongoose = require('mongoose');
const validator = require('validator');
const Color = require('color');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tag must have a name'],
    unique: true,
    trim: true,
    minLength: [2, 'length of tag name must be between 2 and 20 char'],
    maxLength: [20, 'length of tag name must be between 2 and 20 char'],
    validate: [validator.isAlphanumeric, 'please enter a valid alpha-numeric tag name']
  },
  description: {
    type: String,
  },
  moderator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  badge: String,
  bgColor: {
    type: String,
    validate: [validator.isHexColor, 'please enter a valid hexadecimal color for bgColor'],
    set: function (v) {
      if (!v.startsWith('#')) {
        return Color(`#${v}`).hex();
      }
      return Color(v).hex();
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

//
// VIRTUAL PROPS
//
tagSchema.virtual('textColor')
  .get(function () {
    if (this.bgColor) { return Color(this.bgColor, 'hex').negate().hex(); }
    return undefined;
  });

//
// POPULATE VIRTUALS
//
tagSchema.virtual('cards', {
  ref: 'Card',
  localField: '_id',
  foreignField: 'tags'
});

tagSchema.virtual('cardsCount', {
  ref: 'Card',
  localField: '_id',
  foreignField: 'tags',
  count: true
});

//
// MEDLLEWARES
//
tagSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
