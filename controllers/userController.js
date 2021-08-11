const bcrypt = require('bcrypt');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const ApiResources = require('../utils/apiResources');

// MULTER
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Not a image! please try to upload only images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.updateUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/users/${req.file.filename}`);

  next();
});

//

exports.getAll = catchAsync(async (req, res, next) => {
  const api = new ApiResources(User.find(), req.query).paginate();
  const users = await api.query;

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const users = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new AppError(`Can't find id: ${req.params.userId}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.delate = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.userId);

  if (!user) {
    return next(new AppError(`Can't find id: ${req.params.userId}`, 404));
  }

  res.status(204).json({
    status: 'success',
    date: null,
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.userId,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedUser) {
    return next(new AppError(`Can't find id: ${req.params.tagId}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

const fieldsToBeModified = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateCurrentUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("Can't change password in this route! use /updateMyPassword", 400)
    );
  }

  const obj = fieldsToBeModified(req.body, 'name', 'email', 'username', 'bio', 'location');
  if (req.file) obj.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, obj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteCurrentUser = catchAsync(async (req, res, next) => {
  if (!req.body.password) {
    return next(new AppError('Please enter your password', 400));
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError('password not correct! please try agian', 401));
  }

  await User.findByIdAndUpdate(user._id, { active: false });
  res.status(204).json({
    status: 'success',
    message: null,
  });
});

exports.getCurrentUser = catchAsync(async (req, res, next) => {
  req.params.userId = req.user._id;
  next();
});

exports.getUserByUsername = catchAsync(async (req, res, next) => {
  const user = await User.findOne().byUsername(req.params.username);

  if (!user) {
    return next(new AppError(`Can't find username: ${req.params.username}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
