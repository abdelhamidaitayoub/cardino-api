const Card = require('../models/cardModel');

exports.getAll = async (req, res) => {
  try {
    const cards = await Card.find();
    res.json({
      status: 'seccess',
      data: {
        cards,
      },
    });
  } catch (err) {
    res.json({
      status: 'error',
      err,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const card = await Card.create(req.body);
    res.json({
      status: 'seccess',
      data: {
        card,
      },
    });
  } catch (err) {
    res.json({
      status: 'error',
      err,
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    // console.log(req.params);
    const card = await Card.findById(req.params.cardId);
    // if(!card)
    res.json({
      status: 'seccess',
      data: {
        card,
      },
    });
  } catch (err) {
    res.json({
      status: 'error',
      err,
    });
  }
};

exports.delate = async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.cardId);
    res.json({
      status: 'success',
      date: null,
    });
  } catch (err) {
    res.json({
      status: 'error',
      err,
    });
  }
};

exports.update = async (req, res) => {
  try {
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
  } catch (err) {
    res.json({
      status: 'error',
      data: {
        err,
      },
    });
  }
};
