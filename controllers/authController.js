const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Email = require('../utils/email');

const jwtSigning = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.findOne().byUsername(req.body.username);
  if (user) {
    return next(new AppError('That username has been taken. Please choose another.', 422));
  }

  const newUser = await User.create({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    // phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  newUser.password = undefined;
  newUser.passwordConfirm = undefined;
  newUser.active = undefined;

  const url = `${process.env.CLIENT_HOSTNAME}:${process.env.CLIENT_PORT}/settings/profile`;
  await new Email(newUser, url).sendWelcom();

  const token = jwtSigning(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('email or password not correct', 401));
  }

  user.password = undefined;

  const token = jwtSigning(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! please log in to get access', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findOne({ _id: decoded.id });

  if (!currentUser) {
    return next(new AppError('The user with this token no longer exists', 401));
  }

  if (currentUser.isPasswordChangeAfter(decoded.iat)) {
    return next(new AppError('User resently changed password! please log in again', 401));
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You not have permission to access', 403));
    }
    next();
  };

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email!', 404));
  }

  const resetToken = await user.createPasswordResetToken();

  try {
    const resetURL = `${process.env.CLIENT_HOSTNAME}:${process.env.CLIENT_PORT}/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new AppError('there is a problem in sending the email, try again later!', 500)
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or expired', 404));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  // const token = jwtSigning(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Your password has been successfully reset, please login to access'
  });
});

exports.usernameAvailable = catchAsync(async (req, res, next) => {
  const user = await User.findOne().byUsername(req.query.username);
  if (user) {
    return next(new AppError('That username has been taken. Please choose another.', 422));
  }
  res.status(200).json({
    status: 'success',
    message: 'Available!',
    valid: true,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
    return next(
      new AppError('password not correct! please provid correct password', 401)
    );
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  const token = jwtSigning(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});
