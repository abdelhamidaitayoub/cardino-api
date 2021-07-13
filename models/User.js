const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },

  phone: {
    cc: String,
    number: {
      type: String,
      require: true,
      unique: true
    }
  },

  email: {
    type: String,
    require: true,
    unique: true
  },

  password: {
    type: String,
  },

  passwordConfirm: {
    type: String,
  },

  role: {
    type: String,
    enum: ['admin', 'writer', 'reader']
  },

  active: Boolean,
  passwordResetToken: String,
  passwordResetExpire: Number,
  passwordChangedAt: Date,
},{timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
