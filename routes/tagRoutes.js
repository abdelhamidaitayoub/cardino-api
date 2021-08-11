const express = require('express');
const tagController = require('../controllers/tagController');
const cardController = require('../controllers/cardController');
const authController = require('../controllers/authController');

const router = express();

router.get('/:tag/cards', cardController.getAllByTag);

router
  .route('/')
  .get(tagController.getAll)
  .post(
    authController.protect,
    authController.restrictTo('tag-moderator'),
    tagController.create
  );
router
  .route('/:tagId')
  .get(tagController.getOne)
  .delete(tagController.delate)
  .patch(tagController.update);

module.exports = router;
