const express = require('express');
const cardController = require('../controllers/cardController');

const router = express();

router.route('/').get(cardController.getAll).post(cardController.create);
router
  .route('/:cardId')
  .get(cardController.getOne)
  .delete(cardController.delate)
  .patch(cardController.update);

module.exports = router;
