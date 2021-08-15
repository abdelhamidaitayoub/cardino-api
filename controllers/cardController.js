const multer = require('multer');
const sharp = require('sharp');
const Card = require('../models/Card');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const ApiResources = require('../utils/apiResources');

// MULTER
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(
      new AppError('Not a image! please try to upload only images', 400),
      false
    );
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadCardImage = upload.single('image');
exports.uploadCardCover = upload.single('cover');

exports.resizeCardImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `card-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(2000, 1333)
    // .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/cards/${req.file.filename}`);

  next();
});

exports.resizeCardCover = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `card-${req.user.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/cards/${req.file.filename}`);

  next();
});
//

exports.getAll = catchAsync(async (req, res, next) => {
  const api = new ApiResources(Card.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const cards = await api.query;

  res.status(200).json({
    status: 'success',
    result: cards.length,
    data: {
      cards,
    },
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const data = { ...req.body, user: req.user._id };

  if (req.file) data.cover = req.file.filename;
  else data.cover = undefined;

  const card = await Card.create(data);
  res.status(201).json({
    status: 'success',
    data: {
      card,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const card = await Card.findById(req.params.cardId);

  if (!card) {
    return next(new AppError(`Can't find id: ${req.params.cardId}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      card,
    },
  });
});

exports.delate = catchAsync(async (req, res, next) => {
  const card = await Card.findByIdAndDelete(req.params.cardId);

  if (!card) {
    return next(new AppError(`Can't find id: ${req.params.cardId}`, 404));
  }

  res.status(204).json({
    status: 'success',
    date: null,
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const data = { ...req.body };

  if (req.file) data.cover = req.file.filename;

  console.log(data);
  const updatedCard = await Card.findByIdAndUpdate(
    req.params.cardId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCard) {
    return next(new AppError(`Can't find id: ${req.params.cardId}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedCard,
    },
  });
});

exports.getAllByTag = catchAsync(async (req, res, next) => {
  const api = new ApiResources(Card.find({ tags: req.params.tag }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const cards = await api.query;

  res.status(200).json({
    status: 'success',
    result: cards.length,
    data: {
      cards,
    },
  });
});

exports.topFiveForTag = catchAsync(async (req, res, next) => {
  const cards = await Card.find({ tags: req.params.tag })
    .sort({ viewsCount: 1 })
    .limit(5);

  res.status(200).json({
    status: 'success',
    result: cards.length,
    data: {
      cards,
    },
  });
});

exports.uploadImage = catchAsync(async (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}/images/cards/${
    req.file.filename
  }`;
  res.status(200).json({
    status: 'success',
    data: {
      url,
      filename: req.file.filename,
    },
  });
});

exports.addView = catchAsync(async (req, res, next) => {
  const updatedCard = await Card.findOneAndUpdate(
    { slug: req.params.slug },
    { $addToSet: { viewedBy: req.user._id } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCard) {
    return next(new AppError(`Can't find slug: ${req.params.slug}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedCard,
    },
  });
});

exports.toursStats = catchAsync(async (req, res, next) => {
  const stats = await Card.aggregate([
    {
      $match: {},
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        count: { $sum: 1 },
        avgRatings: { $avg: '$ratingsAverage' },
        sumPrice: { $sum: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
