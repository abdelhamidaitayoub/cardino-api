const express = require('express');
const cardController = require('../controllers/cardController');
const Card = require('../models/cardModel'); //! don't forget to delete me pls

const router = express();

router.get('/test', function(req, res) {
  Card.findByTitle('hello');
  res.json({
    status: 'success'
  })
});

router.route('/').get(cardController.getAll).post(cardController.create);
router
  .route('/:cardId')
  .get(cardController.getOne)
  .delete(cardController.delate)
  .patch(cardController.update);


module.exports = router;
