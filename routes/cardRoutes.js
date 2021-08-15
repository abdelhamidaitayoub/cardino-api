const express = require('express');
const cardController = require('../controllers/cardController');
const authController = require('../controllers/authController');

const router = express();

router.patch('/:slug/addView', authController.protect, cardController.addView);
router.get('/stats', cardController.toursStats);

router.post(
  '/uploadImage',
  authController.protect,
  cardController.uploadCardImage,
  cardController.resizeCardImage,
  cardController.uploadImage
);

router
  .route('/')
  .get(cardController.getAll)
  .post(
    authController.protect,
    cardController.uploadCardCover,
    cardController.resizeCardCover,
    cardController.create
  );
router
  .route('/:cardId')
  .get(cardController.getOne)
  .delete(cardController.delate)
  .patch(
    authController.protect,
    cardController.uploadCardCover,
    cardController.resizeCardCover,
    cardController.update
  );

module.exports = router;
