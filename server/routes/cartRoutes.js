const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authorization = require('../middleware/authorization');

router.post('/add', authorization, cartController.addToCart);
router.get('/', authorization, cartController.getCart);
router.delete('/:id', authorization, cartController.removeFromCart);

module.exports = router;
