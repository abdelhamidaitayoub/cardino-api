const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const URL = 'http://localhost:8000/images/users/';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: [true, 'please provide your username'],
    unique: true,
    minlength: [4, 'username must be at least 8 characters'],
    maxlength: [20, 'Username must not exceed 20 characters'],
    lowercase: true,
    // validate: {
    //   validator: function (v) {
    //     return /^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){4,20}[a-zA-Z0-9]$/.test(v);
    //   },
    //   message: (props) => `${props.value} is not a valid username!`
    // },
  },
  name: {
    type: String,
    require: [true, 'please tell us your name'],
  },
  // phone: {
  //   type: String,
  //   unique: true,
  //   validate: [validator.isMobilePhone, 'please provide a valide phone number'],
  // },
  email: {
    type: String,
    require: [true, 'please provide your email'],
    unique: true,
    validate: [validator.isEmail, 'please provide a valide email'],
    lowercase: true
  },
  photo: {
    type: String,
    default: 'user-default.png',
    get: function (v) {
      return `${URL}${v}`;
    }
  },
  bio: {
    type: String,
  },
  location: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: [8, 'password must be at least 8 char'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      // it's work only for SAVE() and CREATE()
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not the same',
    },
    select: false
  },
  role: {
    type: String,
    require: true,
    enum: {
      values: ['admin', 'tag-moderator', 'user'],
      message: "{VALUE} is not supported. user must be a normal 'user' or 'admin'"
    },
    default: 'user'
  },
  active: {
    type: Boolean,
    default: true,
    select: true,
  },
  passwordResetToken: {
    type: String,
    trim: true,
  },
  passwordResetExpire: Date,
  passwordChangedAt: Date,
}, { timestamps: true, toJSON: { getters: true } });

//
// MEDLLEWARES
//
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: true }).select('-__v');
  next();
});

//
// METHODS
//
userSchema.methods.isPasswordChangeAfter = function (iat) {
  if (!this.passwordChangedAt || iat > (this.passwordChangedAt.getTime() / 1000)) {
    return false;
  }
  return true;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpire = Date.now() + 600000;
  await this.save({ validateBeforeSave: false });
  return resetToken;
};

//
// QUERY HELPERS
//

userSchema.query.byUsername = function (username) {
  return this.where({ username });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
