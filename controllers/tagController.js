const Tag = require('../models/Tag');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const ApiResources = require('../utils/apiResources');

exports.getAll = catchAsync(async (req, res, next) => {
  const api = new ApiResources(Tag.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tags = await api.query.populate('cardsCount');

  res.status(200).json({
    status: 'success',
    result: tags.length,
    data: {
      tags,
    },
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const data = { ...req.body, moderator: req.user._id };
  const tag = await Tag.create(data);
  res.status(201).json({
    status: 'success',
    data: {
      tag,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const tag = await Tag.findById(req.params.tagId)
    .populate('cardsCount')
    .populate('cards');

  if (!tag) {
    return next(new AppError(`Can't find id: ${req.params.tagId}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tag,
    },
  });
});

exports.delate = catchAsync(async (req, res, next) => {
  const tag = await Tag.findByIdAndDelete(req.params.tagId);

  if (!tag) {
    return next(new AppError(`Can't find id: ${req.params.tagId}`, 404));
  }

  res.status(204).json({
    status: 'success',
    date: null,
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const updatedTag = await Tag.findByIdAndUpdate(req.params.tagId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTag) {
    return next(new AppError(`Can't find id: ${req.params.tagId}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedTag,
    },
  });
});
