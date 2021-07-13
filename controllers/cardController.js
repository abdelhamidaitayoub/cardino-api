const Card = require('../models/Card');
const CustomError = require('../utils/customError');
const catchAsync = require('../utils/catchAsync');
const ApiResources = require('../utils/apiResources');

exports.getAll = catchAsync(async (req, res, next) => {

  const api = new ApiResources(Card.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const cards = await api.query;
  res.json({
    status: 'seccess',
    result: cards.length,
    data: {
      cards,
    },
  });
});

exports.create = catchAsync(async (req, res) => {
  const card = await Card.create(req.body);
  res.json({
    status: 'seccess',
    data: {
      card,
    },
  });
});

exports.getOne = catchAsync(async (req, res) => {
  // console.log(req.params);
  const card = await Card.findById(req.params.cardId);
  // if(!card)
  res.json({
    status: 'seccess',
    data: {
      card,
    },
  });
});

exports.delate = catchAsync(async (req, res) => {
  await Card.findByIdAndDelete(req.params.cardId);
  res.json({
    status: 'success',
    date: null,
  });
});

exports.update = catchAsync(async (req, res) => {
  const updatedCard = await Card.findByIdAndUpdate(
    req.params.cardId,
    req.body,
    { new: true }
  );
  res.json({
    status: 'success',
    data: {
      updatedCard,
    },
  });
});
